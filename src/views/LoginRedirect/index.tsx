import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Unipass from '../../store/unipass'
import qs from 'qs'

export const LoginRedirect: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const { parseLoginData } = Unipass.useContainer()

  useEffect(() => {
    const { unipass_ret: unipassRet } = qs.parse(location.search.slice(1))
    if (!unipassRet) {
      history.push('/')
      return
    }
    try {
      const data = JSON.parse(unipassRet as string)
      parseLoginData(data.data)
        .then(() => {
          history.push('/')
        })
        .catch(() => {
          console.log('e')
        })
    } catch (e) {
      history.push('/')
    }
  }, [])

  return <div id="loginRedirect" />
}
