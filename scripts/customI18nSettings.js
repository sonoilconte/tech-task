module.exports = {
    locales: [
        { code: 'en-US', file: 'en-US.js', iso: 'en-US' },    
        { code: 'es', file: 'es.js', iso: 'es-ES' }
    ],
    defaultLocale: 'en-US',
    currency: 'USD',
    country: 'US',
    countries: [
      { name: 'US', label: 'United States' },
      { name: 'ES', label: 'Spain' },
    ],
    currencies: [
      { name: 'EUR', label: 'Euro', iso: 'es-ES' },
      { name: 'USD', label: 'Dollar', iso: 'en-US' }
    ],
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


// module.exports = {
//     currency: 'USD',
//     country: 'US',
//     countries: [
//       { name: 'US', label: 'United States' },
//       { name: 'ES', label: 'Spain' },
//     ],
//     currencies: [
//       { name: 'EUR', label: 'Euro', iso: 'es' },
//       { name: 'USD', label: 'Dollar', iso: 'en' }
//     ],
//     locales: [
//       { code: 'en-US', label: 'American English', file: 'en-US.js', iso: 'en-US' },
//       { code: 'es-ES', label: 'Spanish', file: 'es.js', iso: 'es' }
//     ],
//     defaultLocale: 'en-US',
//     lazy: true,
//     langDir: 'lang/',
//     vueI18n: {
//       fallbackLocale: 'en-US',
//       numberFormats: {
//         en: {
//           currency: {
//             style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
//           }
//         },
//         es: {
//           currency: {
//             style: 'currency', currency: 'EUR', currencyDisplay: 'symbol'
//           }
//         }
//       }
//     },
//     detectBrowserLanguage: false,
//     autoChangeCookie: {
//       currency: process.env.MULTICURRENCY_ENABLED !== 'true'
//     },
//     reloadOnLanguageChange: process.env.RELOAD_ON_LANGUAGE_CHANGE !== 'false'
//   };
  


// module.exports = {
//   currency: 'USD',
//   country: 'US',
//   countries: [
//     { name: 'US', label: 'United States' },
//     { name: 'ES', label: 'Spain' }
//   ],
//   currencies: [
//     { name: 'EUR', label: 'Euro' },
//     { name: 'USD', label: 'US Dollar' }
//   ],
//   locales: [
//     {
//       code: 'en-US',
//       label: 'American English',
//       file: 'en-US.js',
//       iso: 'en-US'
//     },
//     { code: 'es', label: 'Spanish', file: 'es.js', iso: 'es' }
//   ],
//   defaultLocale: 'en',
//   lazy: true,
//   langDir: 'lang/',
//   vueI18n: {
//     fallbackLocale: 'en',
//     numberFormats: {
//       en: {
//         currency: {
//           style: 'currency',
//           currency: 'USD',
//           currencyDisplay: 'symbol'
//         }
//       },
//       de: {
//         currency: {
//           style: 'currency',
//           currency: 'EUR',
//           currencyDisplay: 'symbol'
//         }
//       },
//       'en-US': {
//         currency: {
//           style: 'currency',
//           currency: 'EUR',
//           currencyDisplay: 'symbol'
//         }
//       },
//       es: {
//         currency: {
//           style: 'currency',
//           currency: 'ARS',
//           currencyDisplay: 'symbol'
//         }
//       }
//     }
//   },
//   detectBrowserLanguage: false,
//   autoChangeCookie: { currency: true },
//   reloadOnLanguageChange: false
// };
