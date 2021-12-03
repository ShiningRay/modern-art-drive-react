import React, { useEffect } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import Unipass, { parseSuccessUrl } from '../../store/unipass'
import qs from 'qs'

export const LoginRedirect: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const param = useParams<{ action: string }>()
  const { parseLoginData, parseSignData } = Unipass.useContainer()

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
        parseSignData(data.data, args)
          .then(() => {
            history.push('/')
          })
          .catch(() => {
            console.log('e')
          })
      }
    } catch (e) {
      history.push('/')
    }
  }, [])

  return <div id="loginRedirect" />
}
