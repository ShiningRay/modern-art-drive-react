import React, { useEffect } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import Unipass, { parseSuccessUrl } from '../../store/unipass'
import qs from 'qs'
import serverWalletAPI from '../../apis/ServerWalletAPI'
import { sleep } from '../../utils'
import './style.scss'
import System from '../../store/system'
import { getResultFromURL } from '@nervina-labs/flashsigner'
import { LoginType } from '../../constants'

export const LoginRedirect: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const param = useParams<{ action: string }>()
  const {
    parseLoginData,
    parseSignData,
    waitingSign,
    setWaitingSign,
    onSetLoginType,
  } = Unipass.useContainer()
  const { alertMessage, showAlertModal } = System.useContainer()

  useEffect(() => {
    const { action, args } = parseSuccessUrl(param.action)
    const { unipass_ret: unipassRet, flashsigner_data: flashsignerData } =
      qs.parse(location.search.slice(1))

    if (flashsignerData) {
      onSetLoginType(LoginType.Flashsigner)
      getResultFromURL({
        onLogin(res) {
          console.log('onLogin', res)
          parseLoginData({
            email: 'me@admin.com',
            pubkey: res.pubkey,
            address: res.address,
          })
            .then(() => {
              history.push('/')
            })
            .catch(() => {
              console.log('e')
            })
        },
      })

      return
    }

    if (!unipassRet) {
      history.push('/')
      return
    }

    onSetLoginType(LoginType.Unipass)

    try {
      const data = JSON.parse(unipassRet as string)
      if (action === 'login') {
        parseLoginData(data.data)
          .then(() => {
            history.push('/')
          })
          .catch(() => {
            console.log('e')
          })
      } else if (action === 'sign') {
        if (!data.data.sig) {
          history.push('/')
          return
        }
        parseSignData(data.data, args).catch(() => {
          console.log('e')
        })
      }
    } catch (e) {
      history.push('/')
    }
  }, [])

  useEffect(() => {
    if (waitingSign) {
      const label = waitingSign.args.label as string
      const args = waitingSign.args.args
      console.log('get unipass callback:')
      console.log(`  type: ${label}`)
      console.log('  args:')
      console.log(args)
      console.log('  unipass data:')
      console.log(waitingSign.data)

      if (label === 'fix') {
        alertMessage(
          <>
            <div>正在固定你的驱动器</div>
            <div>Fixing your driver...</div>
          </>
        )
        // setText('Fixing your nft...')
        serverWalletAPI
          .fixNft(args[0], args[1], waitingSign.data.sig)
          .then(() => {
            alertMessage(
              <>
                <div>固定成功，稍后片刻</div>
                <div>Fix success, update at 3s.</div>
              </>
            )
            // setText('fix success, update at 3s.')
            setWaitingSign(null)
          })
          .then(async () => {
            await sleep(3000)
            showAlertModal(false)
            history.push('/')
          })
          .catch((e) => console.log(e))
      } else if (label === 'addwords') {
        alertMessage(
          <>
            <div>正在添加你的词条</div>
            <div>Adding your words...</div>
          </>,
          {
            type: 'loading',
          }
        )
        serverWalletAPI
          .addWords(args[0], args[1], args[2], waitingSign.data.sig)
          .then(() => {
            alertMessage(
              <>
                <div>添加成功，稍等片刻</div>
                <div>Add words success, update at 3s.</div>
              </>,
              {
                type: 'loading',
              }
            )
            setWaitingSign(null)
          })
          .then(async () => {
            await sleep(3000)
            showAlertModal(false)
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            history.push(`/?rarity=${args[0]}&tid=${args[1]}`)
          })
          .catch((e) => console.log(e))
      } else if (label === 'refresh') {
        alertMessage(
          <>
            <div>正在刷新你的驱动器</div>
            <div>Refreshing your driver...</div>
          </>,
          {
            type: 'loading',
          }
        )
        // setText('Refreshing your nft...')
        serverWalletAPI
          .refreshNft(args[0], args[1], waitingSign.data.sig)
          .then(() => {
            alertMessage(
              <>
                <div>刷新成功，稍后片刻</div>
                <div>Refresh success, update at 3s.</div>
              </>,
              {
                type: 'loading',
              }
            )
            // setText('refresh success, update at 3s.')
            setWaitingSign(null)
          })
          .then(async () => {
            await sleep(3000)
            showAlertModal(false)
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            history.push(`/?rarity=${args[0]}&tid=${args[1]}`)
          })
          .catch((e) => console.log(e))
      }
    }
  }, [waitingSign])

  return <div id="loginRedirect" />
}
