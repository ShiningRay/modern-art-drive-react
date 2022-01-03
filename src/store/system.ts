import { ReactNode, useCallback, useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { useLocation, matchPath } from 'react-router-dom'
import { OutlandRouterProps, routes } from '../routes'

export interface useSystemProps {
  currentRouter?: OutlandRouterProps
  alertContent: ReactNode
  alertOkButton: boolean
  alertType: AlertMessageOptionType
  alertModalVisible: boolean
  showAlertModal: (alertModalVisible: boolean) => void
  alertMessage: (content: ReactNode, option?: AlertMessageOption) => void
}

export type AlertMessageOptionType = 'loading' | 'error' | 'default'

export interface AlertMessageOption {
  okButton?: boolean
  type?: AlertMessageOptionType
}

function useSystem(): useSystemProps {
  // eslint-disable-next-line prettier/prettier
  const [currentRouter, setCurrentRouter] = useState<OutlandRouterProps | undefined>()
  const location = useLocation()
  const [alertContent, setAlertContent] = useState<ReactNode>()
  const [alertOkButton, setAlertOkButton] = useState(false)
  const [alertType, setAlertType] = useState<AlertMessageOptionType>('default')
  const [alertModalVisible, showAlertModal] = useState(false)

  const alertMessage = useCallback(
    (content: ReactNode, option: AlertMessageOption = {}): void => {
      const okButton = option.okButton ?? false
      const type = option.type ?? 'default'
      setAlertContent(content)
      setAlertOkButton(okButton)
      setAlertType(type)
      showAlertModal(true)
    },
    [setAlertContent, showAlertModal]
  )

  useEffect(() => {
    const r = routes.find((route) => matchPath(location.pathname, route))
    if (r) {
      $('body').attr('data-page-key', r.key)
    } else {
      $('body').removeAttr('data-page-key')
    }

    setCurrentRouter(r)
  }, [location])

  return {
    alertContent,
    alertOkButton,
    alertType,
    alertModalVisible,
    showAlertModal,
    alertMessage,
    currentRouter,
  }
}

const System = createContainer(useSystem)

export default System
