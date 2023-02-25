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
  // Locale code MUST match languages in commercetools exactly
  // file should match file in /lang
  locales: [
    { code: 'en-US', label: 'English (US)', file: 'en.js', iso: 'en' }, // I don't this iso is doing anything for my purposes
    { code: 'es-ES', label: 'Español (España)', file: 'es.js', iso: 'es' }
  ],
  defaultLocale: 'en',
  lazy: true,
  langDir: 'lang/',
  // currency config
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
