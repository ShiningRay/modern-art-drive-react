import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import Unipass, { parseSuccessUrl } from '../../store/unipass'
import qs from 'qs'
import serverWalletAPI from '../../apis/ServerWalletAPI'
import { sleep } from '../../utils'
import { LoadingOutlined } from '@ant-design/icons'
import './style.scss'

export const LoginRedirect: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const param = useParams<{ action: string }>()
  const { parseLoginData, parseSignData, waitingSign, setWaitingSign } =
    Unipass.useContainer()
  const [text, setText] = useState('')

  useEffect(() => {
    const { action, args } = parseSuccessUrl(param.action)
    const { unipass_ret: unipassRet } = qs.parse(location.search.slice(1))
    if (!unipassRet) {
      history.push('/')
      return
    }
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
        setText('Fixing your nft...')
        serverWalletAPI
          .fixNft(args[0], args[1], waitingSign.data.sig)
          .then(() => {
            setText('fix success, update at 3s.')
            setWaitingSign(null)
          })
          .then(async () => {
            await sleep(3000)
            history.push('/')
          })
          .catch((e) => console.log(e))
      } else if (label === 'addwords') {
        setText('Adding your words...')
        serverWalletAPI
          .addWords(args[0], args[1], args[2], waitingSign.data.sig)
          .then(() => {
            setText('add words success, update at 3s.')
            setWaitingSign(null)
          })
          .then(async () => {
            await sleep(3000)
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            history.push(`/?rarity=${args[0]}&tid=${args[1]}`)
          })
          .catch((e) => console.log(e))
      } else if (label === 'refresh') {
        setText('Refreshing your nft...')
        serverWalletAPI
          .refreshNft(args[0], args[1], waitingSign.data.sig)
          .then(() => {
            setText('refresh success, update at 3s.')
            setWaitingSign(null)
          })
          .then(async () => {
            await sleep(3000)
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            history.push(`/?rarity=${args[0]}&tid=${args[1]}`)
          })
          .catch((e) => console.log(e))
      }
    }
  }, [waitingSign])

  return (
    <div id="loginRedirect">
      <div>
        <LoadingOutlined />
      </div>
      <div>{text}</div>
    </div>
  )
}
