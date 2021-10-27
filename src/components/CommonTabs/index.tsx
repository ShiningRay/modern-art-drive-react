import React, { useContext } from 'react'
import classnames from 'classnames'
import styled from 'styled-components'

const CommonTabsContainer = styled.div`
  display: flex;
  border-bottom: #fff solid 1px;
  margin-bottom: 12px;
`
const CommonTabContainer = styled.div`
  text-align: center;
  flex-grow: 1;
  flex-shrink: 1;
  width: 100%;
  opacity: 0.5;
  padding-bottom: 5px;
  border-bottom: transparent solid 2px;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &.active {
    opacity: 1;
    border-bottom-color: #fff;
  }
`

interface CommonTabProps {
  id: string
}

const MyContext = React.createContext({
  activeId: '',
  onActiveIdChange: (activeId: string) => {},
})

export const CommonTab: React.FC<CommonTabProps> = ({ id, children }) => {
  const context = useContext(MyContext)
  const active = context.activeId === id

  return (
    <CommonTabContainer
      className={classnames({ active })}
      onClick={() => context.onActiveIdChange(id)}
    >
      {children}
    </CommonTabContainer>
  )
}

interface CommonTabsProps {
  activeId: string
  onActiveIdChange: (activeId: string) => void
}

export const CommonTabs: React.FC<CommonTabsProps> = ({
  activeId,
  children,
  onActiveIdChange,
}) => {
  return (
    <CommonTabsContainer>
      <MyContext.Provider value={{ activeId, onActiveIdChange }}>
        {children}
      </MyContext.Provider>
    </CommonTabsContainer>
  )
}
