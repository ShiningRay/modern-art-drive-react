import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useHistory } from 'react-router-dom'
import $ from 'jquery'
import qs from 'qs'
import logoImage from '../../assets/img/logo.svg'
import CommonActiveableA from '../../components/CommonActiveableA'
import message from '../../components/CommonMessage'
import System from '../../store/system'
import Unipass from '../../store/unipass'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import './style.scss'

// TODO: 是否要fix header
// const HEADER_TOP = 100

const Header: React.FC = ({ children }) => {
  const { t } = useTranslation('trans')
  const { currentRouter } = System.useContainer()
  const { login, maskedAddress, address, signout } = Unipass.useContainer()
  const history = useHistory()

  return (
    <header>
      <div className="container">
        <div className="menu">
          <CommonActiveableA
            active={currentRouter?.key === 'Home'}
            onClick={() => history.push('/')}
          >
            {t('header.market')}
          </CommonActiveableA>
          <CommonActiveableA>{t('header.community')}</CommonActiveableA>
          <CommonActiveableA>{t('header.create')}</CommonActiveableA>
        </div>
        <img src={logoImage} alt="" className="logo" />
        <div className="opt">
          {maskedAddress && address ? (
            <>
              <a className="learn" onClick={signout}>
                {t('header.disconnect')}
              </a>
              <CopyToClipboard
                text={address}
                onCopy={() => message.success(t('copy'))}
              >
                <a className="connect">{maskedAddress}</a>
              </CopyToClipboard>
            </>
          ) : (
            <a className="connect" onClick={login}>
              {t('header.connect')}
            </a>
          )}
        </div>
      </div>
    </header>
  )
}

const Footer: React.FC = ({ children }) => {
  const { t } = useTranslation('trans')

  return (
    <footer>
      <div className="container">
        <div className="right">{t('footer')}</div>
      </div>
    </footer>
  )
}

export const Layout: React.FC = ({ children }) => {
  const location = useLocation()

  useEffect(() => {
    const { search } = location
    if (!search) return
    const args = qs.parse(search.slice(1)) as { scroll: string }

    const offset = $(`#${args.scroll}`).offset()
    if (offset) {
      setTimeout(() => {
        $([document.documentElement, document.body]).animate(
          {
            scrollTop: offset.top,
          },
          300
        )
      }, 10)
    }
  }, [location])

  return (
    <>
      <Header />
      <div id="pageContent">{children}</div>
      <Footer />
    </>
  )
}
