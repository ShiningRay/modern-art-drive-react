import React from 'react'
import styled from 'styled-components'

const CommonInputContainer = styled.input`
  padding: 4px 8px;
  border: var(--primary-color) solid 2px;
  border-radius: 3px;
  background-color: var(--primary-color-p10);
  color: var(--primary-color);
  outline: none;

  &:hover {
    box-shadow: 0 0 0 2px var(--primary-color-p50);
  }
  &:focus {
    box-shadow: 0 0 0 3px var(--primary-color-p50);
  }
`

interface CommonInputProps {
  id?: string
  className?: string
  isLoading?: boolean
  type?: 'text' | 'password'
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disbaled?: boolean
}

export const CommonInput: React.FC<CommonInputProps> = ({
  children,
  id,
  className,
  value,
  onChange,
  type = 'text',
}) => {
  return (
    <CommonInputContainer
      id={id}
      className={className}
      value={value}
      onChange={onChange}
      type={type}
    >
      {children}
    </CommonInputContainer>
  )
}
