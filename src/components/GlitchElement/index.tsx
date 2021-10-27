import React from 'react'
import classnames from 'classnames'
import './style.scss'

export const GlitchImage: React.FC<{ src: string }> = ({ src }) => {
  return (
    <div className="glitch-element glitch-image">
      <div style={{ backgroundImage: `url(${src})` }} />
      <div style={{ backgroundImage: `url(${src})` }} />
      <div style={{ backgroundImage: `url(${src})` }} />
      <div style={{ backgroundImage: `url(${src})` }} />
      <div style={{ backgroundImage: `url(${src})` }} />
    </div>
  )
}

export const GlitchText: React.FC<{
  className?: string
  style?: React.CSSProperties
}> = ({ children, className, style }) => {
  return (
    <div
      className={classnames('glitch-element glitch-text', className)}
      style={style}
    >
      {children}
    </div>
  )
}
