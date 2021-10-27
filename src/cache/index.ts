const I18N_LANG = 'i18nextLng'

export const LocalCache = {
  setI18nLng(lang: 'zh' | 'en') {
    localStorage.setItem(I18N_LANG, lang)
  },
  getI18nLng() {
    return localStorage.getItem(I18N_LANG)
  },
}
