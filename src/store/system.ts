import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { useLocation, matchPath } from 'react-router-dom'
import { OutlandRouterProps, routes } from '../routes'

interface useSystemStates {
  currentRouter?: OutlandRouterProps
}

export interface useSystemProps {
  currentRouter?: OutlandRouterProps
}

const defaultStates: useSystemStates = {
  currentRouter: undefined,
}

function useSystem(): useSystemProps {
  // eslint-disable-next-line prettier/prettier
  const [currentRouter, setCurrentRouter] = useState<OutlandRouterProps | undefined>(defaultStates.currentRouter)
  const location = useLocation()

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
    currentRouter,
  }
}

const System = createContainer(useSystem)

export default System
