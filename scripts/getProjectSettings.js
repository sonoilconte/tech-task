const { writeFileSync } = require('fs');
const { inspect } = require('util');
const { join } = require('path');
const { buildApiClient, buildRequestParams } = require('./buildApiClient');
const middlewareConfig = require('../middleware.config');
const defaultI18nSettings = require('./defaultI18nSettings');
const currenciesData = require('./currenciesData.json');

const SettingsFileName = {
  generated: 'generatedI18nSettings.js'
};

const buildLabel = (type, value) => new Intl.DisplayNames(['en'], { type }).of(value);

const findCurrencyByLang = lang => {
  const currencyData = currenciesData
    .find(({ languages }) => languages
      .some(field => field === lang));

  return currencyData ? currencyData.currency : 'EUR';
};

const generateI18n = ({ countries = [], currencies = [], languages = [] }) => {
  const template = {
    ...defaultI18nSettings,
    countries: countries.map(country => ({
      name: country,
      label: buildLabel('region', country)
    })),
    currencies: currencies.map(currency => ({
      name: currency,
      label: buildLabel('currency', currency)
    })),
    locales: languages.map(lang => {
      defaultI18nSettings.vueI18n.numberFormats[lang] = {
        currency: {
          style: 'currency',
          currency: findCurrencyByLang(lang),
          currencyDisplay: 'symbol'
        }
      };
      return {
        code: lang,
        label: buildLabel('language', lang),
        file: `${lang}.js`,
        iso: lang
      };
    })
  };

  const generatedTemplate = `module.exports = ${inspect(template, false, null)};
`;

  writeFileSync(join(__dirname, SettingsFileName.generated), generatedTemplate, 'utf-8');
};

const { apiClient } = buildApiClient(middlewareConfig);

const getSettings = async () => {
  try {
    return (await apiClient.execute(
      buildRequestParams({ uri: `/${middlewareConfig.integrations.ct.configuration.api.projectKey}` })
    ));
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  const { body } = await getSettings();
  generateI18n(body);
})();
