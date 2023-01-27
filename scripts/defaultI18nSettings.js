module.exports = {
  currency: 'USD',
  country: 'US',
  countries: [
    { name: 'US', label: 'United States', states: ['California', 'Nevada'] },
    { name: 'AT', label: 'Austria' },
    { name: 'DE', label: 'Germany' },
    { name: 'NL', label: 'Netherlands' }
  ],
  currencies: [
    { name: 'EUR', label: 'Euro', iso: 'de' },
    { name: 'USD', label: 'Dollar', iso: 'en' }
  ],
  locales: [
    { code: 'en', label: 'English', file: 'en.js', iso: 'en' },
    { code: 'de', label: 'German', file: 'de.js', iso: 'de' }
  ],
  defaultLocale: 'en',
  lazy: true,
  langDir: 'lang/',
  vueI18n: {
    fallbackLocale: 'en',
    numberFormats: {
      en: {
        currency: {
          style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
        }
      },
      de: {
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
