import React from 'react'
import styled from 'styled-components'
import classnames from 'classnames'

const CommonSwitchContainer = styled.span`
  display: inline-block;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 12px;

  span {
    display: inline-block;
    border: transparent solid 2px;
    height: 20px;
    line-height: 20px;
  }

  .icon {
    text-align: center;
    width: 20px;
    font-size: 14px;
    border-color: var(--primary-color);
    border-radius: 3px;
    margin-right: 5px;
  }

  &.checked {
    .icon {
      background-color: var(--primary-color);
      color: #000;
    }
  }
`

interface CommonSwitchProps {
  id?: string
  className?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export const CommonSwitch: React.FC<CommonSwitchProps> = ({
  children,
  id,
  className,
  checked = false,
  onCheckedChange,
}) => {
  return (
    <CommonSwitchContainer
      id={id}
      className={classnames(className, { checked })}
      onClick={() => onCheckedChange(!checked)}
    >
      <span className="icon">O</span>
      <span className="label">{children}</span>
    </CommonSwitchContainer>
  )
}
