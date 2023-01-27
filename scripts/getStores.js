const { writeFileSync } = require('fs');
const { inspect } = require('util');
const { join } = require('path');
const { buildApiClient, buildRequestParams } = require('./buildApiClient');
const middlewareConfig = require('../middleware.config');
const storesConfig = require('./storesConfig.json');

const { apiClient } = buildApiClient(middlewareConfig);

const getLabel = (key, field) => {
  const domain = storesConfig.domains.find(domain => domain?.key === key);
  return domain?.[field];
};

const generateConfig = results => {
  const stores = results.map(({ key, id, languages }) => ({
    domain: getLabel(key, 'domain'),
    key,
    id,
    languages,
    name: getLabel(key, 'brand'),
    protocol: getLabel(key, 'protocol')
  }));

  const template = {
    stores,
    defaultStore: storesConfig.defaultStore
  };

  const generatedTemplate = `module.exports = ${inspect(template, false, null)};
`;

  writeFileSync(join(__dirname, 'generatedStores.js'), generatedTemplate, 'utf-8');
};

const getStores = async () => {
  try {
    return (await apiClient.execute(
      buildRequestParams({ uri: `/${middlewareConfig.integrations.ct.configuration.api.projectKey}/stores` })
    ));
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  const { body: { results } } = await getStores();
  generateConfig(results);
})();
