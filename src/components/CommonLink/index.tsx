import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CommonModal from '../CommonModal'
import './style.scss'

const PROTOCOL_REP = /^([a-zA-Z]+):\/\/(.+)$/

interface LinkResult {
  type: 'url' | 'wechat' | 'default'
  target: string
}

function getLinkResult(link: string): LinkResult {
  if (link.startsWith('//')) {
    return {
      type: 'url',
      target: link,
    }
  }
  const match = link.match(PROTOCOL_REP)
  if (match) {
    const [, protocol, target] = match
    if (protocol === 'http' || protocol === 'https') {
      return {
        type: 'url',
        target,
      }
    }
    if (protocol === 'wechat') {
      return {
        type: 'wechat',
        target,
      }
    }
  }
  return {
    type: 'default',
    target: link,
  }
}

interface CommomWechatLinkProps {
  className?: string
  target: string
}
const CommomWechatLink: React.FC<CommomWechatLinkProps> = ({
  children,
  target,
  ...rest
}) => {
  const [visible, showModal] = useState(false)

  return (
    <>
      <a {...rest} onClick={() => showModal(true)}>
        {children}
      </a>
      <CommonModal visible={visible} onClose={() => showModal(false)}>
        <div className="common-link-wechat-img">
          <img src={target} alt="" />
        </div>
      </CommonModal>
    </>
  )
}

interface CommonLinkProps {
  to: string
  className?: string
  onClick?: () => void
}
const CommonLink: React.FC<CommonLinkProps> = ({
  to,
  children,
  onClick,
  ...rest
}) => {
  const result = useMemo(() => getLinkResult(to), [to])
  const { type, target } = result
  if (type === 'default') {
    return (
      <Link to={target} {...rest} onClick={onClick}>
        {children}
      </Link>
    )
  }
  if (type === 'wechat') {
    return (
      <CommomWechatLink target={target} {...rest}>
        {children}
      </CommomWechatLink>
    )
  }
  return (
    <a href={target} {...rest}>
      {children}
    </a>
  )
}

export default CommonLink
