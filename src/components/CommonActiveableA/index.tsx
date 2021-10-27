import React from 'react'
import classnames from 'classnames'
import './style.scss'

// eslint-disable-next-line prettier/prettier
interface CommonActiveableAProps extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  active?: boolean
}

const CommonActiveableA: React.FC<CommonActiveableAProps> = ({
  active,
  className,
  children,
  ...rest
}) => {
  return (
    <a
      className={classnames('common-activeable-a', className, { active })}
      {...rest}
    >
      {children}
    </a>
  )
}

export default CommonActiveableA
