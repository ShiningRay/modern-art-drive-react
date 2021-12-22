import React, { useEffect } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import Unipass, { parseSuccessUrl } from '../../store/unipass'
import qs from 'qs'
import serverWalletAPI from '../../apis/ServerWalletAPI'
import { sleep } from '../../utils'
import message from '../../components/CommonMessage'
import './style.scss'

export const LoginRedirect: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const param = useParams<{ action: string }>()
  const { parseLoginData, parseSignData, waitingSign, setWaitingSign } =
    Unipass.useContainer()

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
        serverWalletAPI
          .fixNft(args[0], args[1], waitingSign.data.sig)
          .then(() => {
            message.success('fix success, update at 3s.')
            setWaitingSign(null)
          })
          .then(async () => {
            await sleep(3000)
            history.push('/')
          })
          .catch((e) => console.log(e))
      } else if (label === 'addwords') {
        serverWalletAPI
          .addWords(args[0], args[1], args[2], waitingSign.data.sig)
          .then(() => {
            message.success('add words success, update at 3s.')
            setWaitingSign(null)
          })
          .then(async () => {
            await sleep(3000)
            history.push('/')
          })
          .catch((e) => console.log(e))
      } else if (label === 'refresh') {
        serverWalletAPI
          .refreshNft(args[0], args[1], waitingSign.data.sig)
          .then(() => {
            message.success('refresh success, update at 3s.')
            setWaitingSign(null)
          })
          .then(async () => {
            await sleep(3000)
            history.push('/')
          })
          .catch((e) => console.log(e))
      }
    }
  }, [waitingSign])

  return <div id="loginRedirect">Processing...</div>
}
