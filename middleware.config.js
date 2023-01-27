const { ctCustomQueries } = require('./extensions/ct');
require('dotenv').config();

const stringToArrayValue = (val, separator = ',') => {
  return typeof val === 'string' ? val.split(separator) : [];
}

module.exports = {
  integrations: {
    ct: {
      location: '@vsf-enterprise/commercetools-api/server',
      configuration: {
        api: {
          uri: process.env.VSF_API_URI,
          apiHost: process.env.VSF_API_HOST,
          authHost: process.env.VSF_API_AUTH_HOST,
          projectKey: process.env.VSF_PROJECT_KEY,
          clientId: process.env.VSF_API_CLIENT_ID,
          clientSecret: process.env.VSF_API_CLIENT_SECRET,
          scopes: stringToArrayValue(process.env.VSF_API_SCOPES)
        },
        serverApi: {
          clientId: process.env.VSF_SERVER_API_CLIENT_ID,
          clientSecret: process.env.VSF_SERVER_API_CLIENT_SECRET,
          scopes: stringToArrayValue(process.env.VSF_SERVER_API_SCOPES),
          operations: stringToArrayValue(process.env.VSF_SERVER_API_OPERATIONS),
        },
        currency: 'USD',
        country: 'US',
        languageMap: {
          en: ['en', 'de'],
          de: ['de', 'en']
        }
      },
      customQueries: ctCustomQueries
    }
  }
};
