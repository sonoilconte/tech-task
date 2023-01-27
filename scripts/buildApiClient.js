const { createClient } = require('@commercetools/sdk-client');
const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth');
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http');
const { createRequestBuilder } = require('@commercetools/api-request-builder');
const fetch = require('node-fetch');

const buildApiClient = ({ integrations }) => {
  const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: integrations.ct.configuration.api.authHost,
    projectKey: integrations.ct.configuration.api.projectKey,
    credentials: {
      clientId: integrations.ct.configuration.serverApi.clientId,
      clientSecret: integrations.ct.configuration.serverApi.clientSecret
    },
    scopes: integrations.ct.configuration.serverApi.scopes,
    fetch
  });
  const httpMiddleware = createHttpMiddleware({
    host: integrations.ct.configuration.api.apiHost,
    fetch
  });
  const client = createClient({
    middlewares: [authMiddleware, httpMiddleware]
  });

  return {
    apiClient: client,
    requestBuilder: createRequestBuilder({ projectKey: integrations.ct.configuration.api.projectKey })
  };
};

const buildRequestParams = ({ uri, method, headers = {}, body }) => ({
  uri,
  method: method || 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers
  },
  body: body
});

module.exports = {
  buildApiClient,
  buildRequestParams
};
