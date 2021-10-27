import React from 'react'
import styled from 'styled-components'

const CommonButtonContainer = styled.button`
  padding: 6px 12px;
  border: var(--primary-color) solid 2px;
  border-radius: 3px;
  background-color: var(--primary-color-p10);
  color: var(--primary-color);
  cursor: pointer;

  &:hover {
    background-color: var(--primary-color-p25);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

interface CommonButtonProps {
  id?: string
  className?: string
  isLoading?: boolean
  type?: 'default' | 'primary' | 'black'
  onClick?: () => void
  disabled?: boolean
}

export const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  id,
  className,
  onClick,
  disabled = false,
}) => {
  return (
    <CommonButtonContainer
      id={id}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </CommonButtonContainer>
  )
}
