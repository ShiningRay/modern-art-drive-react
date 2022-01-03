import React, { ReactNode } from 'react'
import './style.scss'

interface CommonPageTitleProps {
  title: string
  subTitle: string
  size?: '1' | '2' | '3'
  extra?: ReactNode
}

const CommonPageTitle: React.FC<CommonPageTitleProps> = ({
  title,
  subTitle,
  size = '1',
  extra,
}) => {
  return (
    <div className={`common-page-title size-${size}`}>
      <span>{title}</span>
      <span className="sub">{subTitle}</span>
      {extra && <div className="extra">{extra}</div>}
    </div>
  )
}

export default CommonPageTitle
