import React, { ReactElement, useCallback } from 'react'
import classnames from 'classnames'
import styled from 'styled-components'
import ReactDom from 'react-dom'
import okImg from '../../assets/img/btn-ok.svg'
import System from '../../store/system'
import { LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons'

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
      background-color: #fff;
      transform: translate3d(-50%, -50%, 0);
      border-radius: 3px;
      color: var(--main-text);
      min-width: 300px;
      max-width: calc(100vw - 24px);
    }
    &-title {
      padding: 6px 16px;
      border-bottom: #ddd solid 1px;
      flex-grow: 0;
      flex-shrink: 0;
      font-size: 24px;
    }
    &-content {
      padding: 16px;
      overflow: auto;
      flex-grow: 1;
      flex-shrink: 1;
    }
  }

  .cm-alert-modal {
    text-align: center;

    &-type {
      font-size: 36px;
      margin-bottom: 12px;
    }
    &-content {
      margin-bottom: 12px;
    }
    &-opt {
      button {
        height: 35px;
        width: 86px;
        padding: 6px 24px;
        border-radius: 3px;
        cursor: pointer;
        text-decoration: none;
        background-color: #25282a;
        color: #fff;
        border: none;
      }
    }
  }
`

export interface CommonModalProps {
  visible: boolean
  onClose: () => void
  title?: string | ReactElement
  className?: string
  popoutStyle?: React.CSSProperties
}

const CommonModal: React.FC<CommonModalProps> = ({
  children,
  visible,
  onClose,
  title,
  className,
  popoutStyle,
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
      <div
        className={classnames('cm-modal-popout', className)}
        style={popoutStyle}
      >
        {title && <div className="cm-modal-title">{title}</div>}
        <div className="cm-modal-content">{children}</div>
      </div>
    </CommonModalContainer>
  )

  return ReactDom.createPortal(dom, document.body)
}

export default CommonModal

export const CommonAlertModal: React.FC = () => {
  const {
    alertModalVisible,
    showAlertModal,
    alertOkButton,
    alertContent,
    alertType,
  } = System.useContainer()

  const handleClose = (): void => {
    if (alertOkButton) {
      showAlertModal(false)
    }
  }

  return (
    <CommonModal visible={alertModalVisible} onClose={handleClose}>
      <div className="cm-alert-modal">
        <div className="cm-alert-modal-type">
          {alertType === 'loading' && <LoadingOutlined />}
          {alertType === 'error' && <CloseCircleOutlined />}
        </div>
        <div className="cm-alert-modal-content">{alertContent}</div>
        {alertOkButton && (
          <div className="cm-alert-modal-opt">
            <button onClick={handleClose}>
              <img src={okImg} alt="" />
            </button>
          </div>
        )}
      </div>
    </CommonModal>
  )
}
