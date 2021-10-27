import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import $ from 'jquery'
import qs from 'qs'
import logoImage from '../../assets/img/logo.svg'
import CommonActiveableA from '../../components/CommonActiveableA'
import System from '../../store/system'
import Unipass from '../../store/unipass'
import './style.scss'

// TODO: 是否要fix header
// const HEADER_TOP = 100

const Header: React.FC = ({ children }) => {
  const { t } = useTranslation('trans')
  const { currentRouter } = System.useContainer()
  const { login, maskedAddress } = Unipass.useContainer()

  return (
    <header>
      <div className="container">
        <div className="menu">
          <CommonActiveableA active={currentRouter?.key === 'Home'}>
            {t('header.market')}
          </CommonActiveableA>
          <CommonActiveableA>{t('header.community')}</CommonActiveableA>
          <CommonActiveableA>{t('header.create')}</CommonActiveableA>
        </div>
        <img src={logoImage} alt="" className="logo" />
        <div className="opt">
          <a className="learn" href="">
            {t('header.learn')}
          </a>
          {maskedAddress ? (
            <a className="connect">{maskedAddress}</a>
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
      {children}
      <Footer />
    </>
  )
}
