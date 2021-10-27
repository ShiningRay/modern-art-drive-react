import React from 'react'
import './style.scss'

const CommonPageTitle: React.FC<{ lines: string[] }> = ({ lines }) => {
  return (
    <div className="common-page-title">
      <div className="container">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  )
}

export default CommonPageTitle
