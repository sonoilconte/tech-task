module.exports = {
  currency: 'USD',
  country: 'US',
  countries: [
    { name: 'US', label: 'United States' },
    { name: 'ES', label: 'Spain' },
  ],
  // iso here must match currency icon file name in /static/icons/langs, e.g. iso: 'en' -> en.webp
  currencies: [
    { name: 'USD', label: 'Dollar', iso: 'en' },
    { name: 'EUR', label: 'Euro', iso: 'es' },
  ],
  // Locale code must match languages in commercetools exactly
  // file should match file in /lang, e.g. en.js
  // Locale code must match icon file name in /static/icons/langs, e.g. code: 'en-US' -> en-US.webp 
  locales: [
    { code: 'en-US', label: 'English', file: 'en.js', iso: 'en' }, // I don't this iso here is doing anything for my purposes
    { code: 'es-ES', label: 'Español', file: 'es.js', iso: 'es' },
  ],
  defaultLocale: 'en-US',
  lazy: true,
  langDir: 'lang/',
  vueI18n: {
    fallbackLocale: 'en-US',
    numberFormats: {
      en: {
        currency: {
          style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
        }
      },
      es: {
        currency: {
          style: 'currency', currency: 'EUR', currencyDisplay: 'symbol'
        }
      }
    }
  },
  detectBrowserLanguage: false,
  autoChangeCookie: {
    currency: process.env.MULTICURRENCY_ENABLED !== 'true'
  },
  reloadOnLanguageChange: process.env.RELOAD_ON_LANGUAGE_CHANGE !== 'false'
};
