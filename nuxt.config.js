import webpack from 'webpack';
import defaultI18nSettings from './scripts/defaultI18nSettings';

// Client side middleware url
const middlewareUrl = process.env.NODE_ENV === 'production'
  ? process.env.API_BASE_URL
  : 'http://localhost:8181';

// Server side middleware url
const ssrMiddlewareUrl = process.env.NODE_ENV === 'production'
  ? process.env.API_SSR_BASE_URL
  : 'http://localhost:8181';

export default {
  dev: process.env.NODE_ENV !== 'production',
  publicRuntimeConfig: {
    middlewareUrl,
    ssrMiddlewareUrl
  },
  server: {
    port: 3000,
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ],
    script: []
  },
  loading: { color: '#fff' },
  router: {
    middleware: [],
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: 'home',
          path: '/',
          component: resolve(__dirname, 'pages/Home.vue')
        },
        {
          name: 'product',
          path: '/p/:slug/:sku/',
          component: resolve(__dirname, 'pages/Product.vue')
        },
        {
          name: 'category',
          path: '/c/:slug_1/:slug_2?/:slug_3?/:slug_4?/:slug_5?',
          component: resolve(__dirname, 'pages/Category.vue')
        },
        {
          name: 'my-account',
          path: '/my-account/:pageName?',
          component: resolve(__dirname, 'pages/MyAccount.vue')
        },
        {
          name: 'checkout',
          path: '/checkout',
          component: resolve(__dirname, 'pages/Checkout.vue'),
          children: [
            {
              path: 'customer',
              name: 'customer',
              component: resolve(__dirname, 'pages/Checkout/Customer.vue')
            },
            {
              path: 'billing',
              name: 'billing',
              component: resolve(__dirname, 'pages/Checkout/Billing.vue')
            },
            {
              path: 'shipping',
              name: 'shipping',
              component: resolve(__dirname, 'pages/Checkout/Shipping.vue')
            },
            {
              path: 'payment',
              name: 'payment',
              component: resolve(__dirname, 'pages/Checkout/Payment.vue')
            },
            {
              path: 'thank-you',
              name: 'thank-you',
              component: resolve(__dirname, 'pages/Checkout/ThankYou.vue')
            }
          ]
        },
        {
          name: 'reset-password',
          path: '/reset-password',
          component: resolve(__dirname, 'pages/ResetPassword.vue')
        },
        {
          name: 'cart',
          path: '/cart',
          component: resolve(__dirname, 'pages/Cart.vue')
        });
    }
  },
  buildModules: [
    // to core
    '@nuxtjs/composition-api/module',
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    '@nuxtjs/google-fonts',
    // to core soon
    '@nuxtjs/pwa',
    [
      '@vsf-enterprise/commercetools/nuxt',
      {
        i18n: {
          useNuxtI18nConfig: true
        },
        faceting: {
          pageOptions: [20, 50, 100],
          subcategoriesLimit: 100,
          availableFacets: [
            {
              facet: 'categories.id',
              type: 'string',
              option: 'subtree("*")',
              name: 'category',
              filteringStrategy: 'query'
            },
            {
              facet: 'variants.availability.isOnStockInChannels',
              type: 'string',
              option: '',
              name: 'availability',
              filteringStrategy: 'query'
            },
            {
              facet: 'variants.attributes.size',
              type: 'string',
              option: '',
              name: 'size'
            },
            {
              facet: 'variants.attributes.color.key',
              type: 'string',
              option: '',
              name: 'color'
            }
          ],
          sortingOptions: [
            {
              id: 'latest',
              name: 'Latest',
              facet: 'createdAt',
              direction: 'desc'
            },
            {
              id: 'price-up',
              name: 'Price from low to high',
              facet: 'price',
              direction: 'asc'
            },
            {
              id: 'price-down',
              name: 'Price from high to low',
              facet: 'price',
              direction: 'desc'
            },
            {
              id: 'relevance',
              name: 'Relevance',
              facet: 'score',
              direction: 'desc'
            }
          ],
          filteringStrategy: 'filter'
        },
        enableClickCollect: process.env.CLICK_COLLECT_ENABLED === 'true',
        enableMultiStore: process.env.MULTISTORE_ENABLED === 'true',
        enableMultiCurrency: process.env.MULTICURRENCY_ENABLED === 'true',
        enableChannelFilter: process.env.CHANNEL_FILTER_ENABLED === 'true',
        collectShippingKey: process.env.COLLECT_SHIPPING || 'collect',
        reloadOnLanguageChange: process.env.RELOAD_ON_LANGUAGE_CHANGE !== 'false',
        enableMultiDomain: false,
        enableCustomerCheckoutStep: true
      }],
    [
      '@vue-storefront/nuxt',
      {
        useRawSource: {
          dev: ['@vue-storefront/core', '@vsf-enterprise/commercetools'],
          prod: ['@vue-storefront/core', '@vsf-enterprise/commercetools']
        }
      }]
  ],
  modules: [
    ...(process.env.CLICK_COLLECT_ENABLED
      ? [
        [
          'nuxt-gmaps',
          {
            key: process.env.GMAPS_KEY
          }
        ]
      ]
      : []),
    '@nuxtjs/i18n',
    'cookie-universal-nuxt',
    '@nuxt/image',
    [
      '@vue-storefront/http-cache/nuxt',
      {
        matchRoute: {
          '/': 'max-age=1800, s-maxage=86400, stale-while-revalidate=86400',
          '/p/*': 'max-age=300, s-maxage=3600, stale-while-revalidate=86400',
          '/c/*': 'max-age=300, s-maxage=3600, stale-while-revalidate=86400',
          '/my-account': 'none',
          '/checkout*': 'none'
        }
      }
    ]
  ],
  plugins: [
    { src: '~/plugins/withCredentials.js' },
    { src: '~/plugins/filters.ts' },
    { src: '~/plugins/interceptors.js', mode: 'client' }
  ],
  serverMiddleware: [
    '~/serverMiddleware/body-parser.js',
    {
      path: '/healthz', handler: '~/serverMiddleware/healthCheck.js'
    }
  ],
  i18n: defaultI18nSettings,
  styleResources: {
    scss: [
      require.resolve('@storefront-ui/shared/styles/_helpers.scss', {
        paths: [process.cwd()]
      })
    ]
  },
  build: {
    extractCSS: true,
    babel: {
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]]
    },
    transpile: ['@glidejs/glide'],
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || ''
        })
      })
    ]
  },
  pwa: {
    manifest: {
      name: 'Vue Storefront with commercetools',
      short_name: 'VSF',
      description: 'Demo of Vue Storefront, Lightning-Fast Frontend for Headless Commerce'
    },
    meta: {
      theme_color: '#5ECE7B',
      name: 'Vue Storefront with commercetools'
    }
  },
  image: {
    provider: process.env.NUXT_IMAGE_PROVIDER,
    cloudinary: {
      baseURL: process.env.NUXT_IMAGE_PROVIDER_BASE_URL
    }
  },
  googleFonts: {
    families: {
      Raleway: {
        wght: [300, 400, 500, 600, 700],
        ital: [400]
      },
      Roboto: {
        wght: [300, 400, 500, 700],
        ital: [300, 400]
      }
    },
    display: 'swap'
  }
};
