import React, { useCallback } from 'react'
import classnames from 'classnames'
import styled from 'styled-components'
import ReactDom from 'react-dom'

const CommonModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: none;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;

  &.visible {
    display: block;
  }

  .cm-modal {
    &-popout {
      max-height: calc(100vh - 80px);
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      border: var(--primary-color) solid 2px;
      border-radius: 3px;
      background-color: var(--primary-color-p10);
      color: var(--primary-color);
    }
    &-title {
      padding: 6px 16px;
      border-bottom: var(--primary-color) solid 2px;
      flex-grow: 0;
      flex-shrink: 0;
    }
    &-content {
      padding: 16px;
      overflow: auto;
      flex-grow: 1;
      flex-shrink: 1;
    }
  }
`

interface CommonModalProps {
  visible: boolean
  onClose: () => void
  title?: string | React.Component
  className?: string
}

const CommonModal: React.FC<CommonModalProps> = ({
  children,
  visible,
  onClose,
  title,
  className,
}) => {
  const handleContainerClick: React.MouseEventHandler<HTMLDivElement> =
    useCallback(
      (e) => {
        if (e.target === e.currentTarget) {
          onClose()
          e.stopPropagation()
        }
      },
      [onClose]
    )

  const dom = (
    <CommonModalContainer
      className={classnames({ visible })}
      onClick={handleContainerClick}
    >
      <div className={classnames('cm-modal-popout', className)}>
        {title && <div className="cm-modal-title">{title}</div>}
        <div className="cm-modal-content">{children}</div>
      </div>
    </CommonModalContainer>
  )

  return ReactDom.createPortal(dom, document.body)
}

export default CommonModal
