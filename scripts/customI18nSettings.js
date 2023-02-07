module.exports = {
    currency: 'USD',
    country: 'US',
    countries: [
      { name: 'US', label: 'United States' },
      { name: 'ES', label: 'Spain' },
    ],
    currencies: [
      { name: 'USD', label: 'Dollar', iso: 'en' },
      { name: 'EUR', label: 'Euro', iso: 'es' },
    ],
    // I think code on the locale must match commerce tools exactly —> en-US, es
    locales: [
        { code: 'en-US', file: 'en.js', iso: 'en' },    
        { code: 'es', file: 'es.js', iso: 'es' },
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
      },
    },
    detectBrowserLanguage: false,
    autoChangeCookie: {
      currency: process.env.MULTICURRENCY_ENABLED !== 'true'
    },
    reloadOnLanguageChange: process.env.RELOAD_ON_LANGUAGE_CHANGE !== 'false',
};