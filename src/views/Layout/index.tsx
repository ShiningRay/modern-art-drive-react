import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import $ from 'jquery'
import qs from 'qs'
import logoImage from '../../assets/img/logo.svg'
import message from '../../components/CommonMessage'
import Unipass from '../../store/unipass'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Marquee from 'react-fast-marquee'
import './style.scss'
import serverWalletAPI, { RecnetFixData } from '../../apis/ServerWalletAPI'

// TODO: 是否要fix header
// const HEADER_TOP = 100

const Header: React.FC = ({ children }) => {
  const [recentFix, setRecnetFix] = useState<RecnetFixData[]>([])
  const { t } = useTranslation('trans')
  const { login, maskedAddress, address, signout } = Unipass.useContainer()

  useEffect(() => {
    serverWalletAPI
      .getRecnetFix()
      .then(setRecnetFix)
      .catch((e) => console.log(e))
  }, [])

  return (
    <>
      {recentFix.length > 0 && (
        <Marquee className="fixed-marquee">
          {recentFix.map((fix) => (
            <span>{`#${fix.tid} Fixed: ${fix.sentence.en}; ${fix.sentence.zh}`}</span>
          ))}
        </Marquee>
      )}
      <header>
        <div className="container">
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
    </>
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
