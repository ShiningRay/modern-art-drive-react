import React from 'react'
import './style.scss'

interface CommonPageTitleProps {
  title: string
  subTitle: string
  size?: '1' | '2'
}

const CommonPageTitle: React.FC<CommonPageTitleProps> = ({
  title,
  subTitle,
  size = '1',
}) => {
  return (
    <div className={`common-page-title size-${size}`}>
      <span>{title}</span>
      <span>{subTitle}</span>
    </div>
  )
}

export default CommonPageTitle
