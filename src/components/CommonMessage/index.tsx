import React from 'react'
import ReactDOM from 'react-dom'
import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
  WarningFilled,
} from '@ant-design/icons'

import './style.scss'

interface CommonMessageProps {
  message: string
  type: 'info' | 'success' | 'warn' | 'error'
}

export const CommonMessage: React.FC<CommonMessageProps> = ({
  message,
  type = 'info',
}) => {
  let icon = <InfoCircleFilled />
  if (type === 'success') {
    icon = <CheckCircleFilled />
  } else if (type === 'error') {
    icon = <CloseCircleFilled />
  } else if (type === 'warn') {
    icon = <WarningFilled />
  }
  return (
    <div className={`cm-message ${type}`}>
      {icon}
      <span>{message}</span>
    </div>
  )
}

const rootId = `m${Math.round(Math.random() * 10000)}`

const message = {
  show(message: string, type: 'info' | 'success' | 'warn' | 'error'): void {
    let messageRoot: HTMLDivElement = document.querySelector(
      `#${rootId}`
    ) as HTMLDivElement
    if (!messageRoot) {
      messageRoot = document.createElement('div')
      messageRoot.id = rootId
      messageRoot.className = 'cm-message-container'
      document.body.append(messageRoot)
    }
    const container: HTMLDivElement = document.createElement('div')
    messageRoot.append(container)
    ReactDOM.render(<CommonMessage message={message} type={type} />, container)
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(container)
      container.remove()
      if (messageRoot.children.length === 0) {
        messageRoot.remove()
      }
    }, 3000)
  },
  info(message: string): void {
    this.show(message, 'info')
  },
  success(message: string): void {
    this.show(message, 'success')
  },
  warn(message: string): void {
    this.show(message, 'warn')
  },
  error(message: string): void {
    this.show(message, 'error')
  },
}

export default message
