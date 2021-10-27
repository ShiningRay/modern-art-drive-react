import React from 'react'
import { useTranslation } from 'react-i18next'
import CommonPageTitle from '../../components/CommonPageTitle'
import './style.scss'

export const Home: React.FC = () => {
  const { t } = useTranslation('trans')

  return (
    <div id="home">
      <CommonPageTitle lines={t('market.title').split('\n')} />
    </div>
  )
}
