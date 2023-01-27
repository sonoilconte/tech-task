# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.10.1](https://github.com/vuestorefront/commercetools/compare/v1.10.0...v1.10.1) (2023-01-10)

### Bug Fixes
* add missing VSF_PROJECT_KEY in the `middleware.Dockerfile`
* add missing `dotenv` package

# [1.10.0](https://github.com/vuestorefront/commercetools/compare/v1.9.0...v1.10.0) (2022-12-27)


### Bug Fixes

* expected an assignment or function call and instead saw an expression ([d41ccbe](https://github.com/vuestorefront/commercetools/commit/d41ccbe943adf95f881b23201b356fe52b75efac))
* replace <b> tag with <strong> ([08031b4](https://github.com/vuestorefront/commercetools/commit/08031b4719d9d5a8b41b236c1b4c9c0266f13ad6))
* update core package 2.7.2 -> 2.7.4 ([053e6bb](https://github.com/vuestorefront/commercetools/commit/053e6bb1773085fa1b475484860d56e230e8cb36))


### Features

* add separated middleware support for multiple domains ([9b2d52e](https://github.com/vuestorefront/commercetools/commit/9b2d52ecc8517d52b608ffdb9e78cb16853aa918))
* use core packages in v2.7.5 ([#439](https://github.com/vuestorefront/commercetools/issues/439)) ([3fecd69](https://github.com/vuestorefront/commercetools/commit/3fecd695f315aa9cd4dd5ae59dd8bcbb49bd7b04))





## 1.9.0

### Features

- feat!: init function and token flow improvement
- chore: upgrade middleware 2.7.1 -> 2.7.2

## 1.8.5 (2022-11-03)

### Bug Fixes

- allow using separated middleware with multiple domains
- return raw response when using customQuery in `useProduct` composable

## 1.8.4 (2022-08-26)

### Bug Fixes

- cart is no longer cleared when choosing store in shipping step
- add missing key back to `getFacetCategories`
- fixed links to products in order history
- unable to place an order with an invalid coupon

### Features

- handle cart discount invalid state
- improve TTFB by reducing api response size
- custom query for `customerUpdateMe`

### Reverts

- `init` function

## 1.8.3 (2022-08-11)

### Bug Fixes

- added option to reload cart
- product page ssr error
- state/province in my account is covered with one of it
- `getCategories` hardcoded limit param
- added option `customFilters` for `useProduct` composable in `search` method

### Features

- implementing `init` function for middleware

## 1.8.2 (2022-07-25)

### Bug Fixes

- replaced `SfHero` carousel with `SfBanner` on homepage
- divided sections on shipping and billing pages
- fixed disappearing padding in `StoreLocator` component
- added `clickOutside` directive from SFUI
- title from `SfMegaMenuColumn` in `SearchResults` is not clickable anymore
- unified order summary on desktop view
- redirect to `404` page on PDP when error occurs
- fixed alignment of products on category page

### Features

- separated middleware initialization
- prevent out of stock purchase for `Click&Collect`
- added empty cart page
- reduced size of product page
- language change without full page reload
- added method `getCategorySlugs` for `productGetters`

## 1.8.1 (2022-07-11)

### Bug Fixes

- removed redundant aria-label from buttons / CLS on PLP
- duplicated products in the cart
- fixed adding promo code on payment step
- fix redirect on checkout
- unable to enter my account page
- bottom navigation overlapping lang modal
- payment method "cash on delivery" is cached after one purchase

### Features

- saved checkout steps
- unifying Click&Collect behavior - Storelocator page removal
- remove all items from the cart
- added login button in checkout
- added loaders for product cards
- added pagination for reviews on PDP

## 1.8.0 (2022-06-29)

### Bug Fixes

- adding and editing addresses in my account
- breadcrumbs linking
- edit button in payment does not work
- wrong language icon
- add custom ClientSideOnly component
- use client-only instead isMounted
- bug with `customQuery` in `useUser.register`
- search results cannot be closed
- hide categories when it not contains any products
- fixed `storelocator` badge position
- lang files missing comma
- pass custom query on to original api method

### Features

- change functional anchors to buttons
- seo improvements
- bundle size optimization
- add new checkout step - customer email
- middleware separation
- node version bump, LTS
- support for screen reader
- added empty states
- add linking to products in cart sidebar
- hide categories when it not contains any products
- links renamed
- update SFUI to 0.13.2

## 1.7.4 (2022-08-26)

### Bug Fixes

- add missing key back to `getFacetCategories`
- fixed images not showing on product list pages

### Features

- custom query for `customerUpdateMe`

## 1.7.3 (2022-08-05)

Please note that these changes are available in version 1.8.3

### Bug Fixes

- `getCategories` hardcoded limit param
- added option `customFilters` for `useProduct` composable in `search` method

## 1.7.2 (2022-05-24)

### Bug Fixes

- added missing store locator icon on mobile devices
- add option to overwrite `enhanceProduct` function
- calculating shipping price with discount
- removed unnecessary checkbox on register screen

### Features

- filter products by channel
- `getCart` api method is now deprecated
- added `http-cache` module

## 1.7.1 (2022-04-26)

:::warning This version is now deprecated. Please use 1.7.2 instead.
:::

### Bug Fixes

- state dropdown is no longer shown when not needed

### Features

- added support for custom field in `setShippingAddressAction` and `setBillingAddressAction`
- added extra parameter for `addReview` and `getReview` in `useReview` composable - where
- additional field in customer update api call - date of birth
- added form for submitting review

## 1.7.0 (2022-04-20)

### Bug Fixes

- added missing styles for `sf-store`
- PLP filters are removed on page reload
- selecting billing address redirects to the home page
- remove setting variable based on header's value
- missing app object for Category page
- pass `customQuery` to `useFacet`
- thank you page `addBasePathFilter` error
- unable to change language after store change
- wishlist import

### Features

- upgrade SFUI in the theme
- add store configuration from `nuxt.config.js`
- add ui notification system
- store-locator design on channel change
- export composables helpers
- add `nuxt-image` module
- remove mobile observer
- set modern=client mode
- click and collect shipping method
- add change method to `useChannel`
- add `agentkeepalive`
- update types

## 1.6.1 (2022-03-24)

### Bug Fixes

- change docker namespace
- **security:** added secure flag for token cookie

### Features

- cache control module - remove cache from theme
- add `customQuery` for `getCart`
- export composables helpers
- native API error handling

## 1.6.0 (2022-02-18)

### Bug Fixes

- `tokenProvider.invalidateTokenInfo() is not a function` error
- add missing env example for Multistore
- redis environment variables names collision
- use `locale` param instead of `acceptLanguage` for faceting api functions
- fixes broken usage of `customQuery` in `useProduct` composable
- fix HTML missmatch onSSR for Home.vue
- add `languageMap` configuration for facet accepted language
- fixed logo not loading while page refresh
- fixed vue warn due to invalid component name
- removing `mockedSearchProducts`
- fix double mounting carousel component
- wishlist not being fetched nor refreshed upon login and logout actions
- breadcrumbs mismatch url
- added missing type for `ProductsSearchParams`
- remove deprecation warning for mode universal
- handle error after `createMyOrderFromCart` request
- nuxt module declaration
- possibility to add products to the cart/wishlist from related
- update deprecated `apollo-link` and `apollo-client`
- error while deleting shipping addresses
- search results add to cart wishlist

### Features

- billing and shipping address not present in checkout
- add composable to get all languages information
- get project settings
- upgrading from `nuxt-i18n` to `nuxtjs/i18n`
- added `priceTransform` helper
- add base path in templates
- added `StoreLocator` component
- add channels api and composable
- add `useInventory`
- multistore feature flag
- add `SameSite` cookie attribute
- backport composables from enterprise packages
- performance improvements
- remove unnecessary css
- add multiple filtering strategy for faceting
- dockerfile update
- useFacet integration inside Home.vue
- optimise footer social icons
- switching currency
- add missing static translations within app via `vue-i18n`

Please refer to the [migration guide](https://docs.vuestorefront.io/commercetools/reference/migrate/1.6.0/) for more
information.

## 1.5.0

### Bug Fixes

- add wishlist build fix
- removing hardcoded categories from HeaderNavigation
- fixed issues with adding/removing products to/from wishlist
- fixed doubled review types export
- fixed navigate to MyAccount page
- fixed wishlist product prices
- fixed handleAfterAuth method for customToken
- bump SFUI version that fixes memory leak
- fix for ancestors on PDP page over SSR and fix for docs
- update use cart method for newer one
- added usage of FiltersSidebar component
- fixed issue related with building valid query
- `tokenProvider.invalidateTokenInfo() is not a function` error
- update deprecated apollo-link and apollo-client
- fixes broken usage of customQuery in useProduct composable
- handle error after createMyOrderFromCart request
- possibility to add products to the cart/wishlist from related

### Features

- coupon codes display &
  removal ([0e689b1](https://github.com/vuestorefront/commercetools/commit/0e689b16395828cdc76d50a711430c968c76b2fe))
- created product breadcrumbs
  getter ([7260c18](https://github.com/vuestorefront/commercetools/commit/7260c18c7bb737112651207bc465371a38c24cd1))
- moved packages from enterprise
  packages ([223e649](https://github.com/vuestorefront/commercetools/commit/223e64900032ee0d929fa7148cf683e9725939ab))
- changed faceting from rest to
  qraphql ([#36](https://github.com/vuestorefront/commercetools/issues/36)) ([3eefa3c](https://github.com/vuestorefront/commercetools/commit/3eefa3ceb8b8863595220c870d892593af23fd8c))
- use cache mechanism with Redis
  driver ([#29](https://github.com/vuestorefront/commercetools/issues/29)) ([6343e66](https://github.com/vuestorefront/commercetools/commit/6343e666f960a151a058cedee3a0de76429803b7))
- create template for commercetools
  integration ([#8](https://github.com/vuestorefront/commercetools/issues/8)) ([b399f55](https://github.com/vuestorefront/commercetools/commit/b399f559d781cf8de1a3634e5c1ab45a8b7e6e86))
- refactor of
  composables ([#34](https://github.com/vuestorefront/commercetools/issues/34)) ([e5af219](https://github.com/vuestorefront/commercetools/commit/e5af21990f287d0ba4302741ccf115936374e890))
- fetch categories with product
  data ([8d0cd0f](https://github.com/vuestorefront/commercetools/commit/8d0cd0ffccf8dd6ec144e62ec0b514724999410f))
- preserve categories in enhanced
  product ([1c977aa](https://github.com/vuestorefront/commercetools/commit/1c977aa29826c61021bceaf9c4c4052f5d3ca920))
- useFacet integration inside
  Home.vue ([1e8fd721](https://github.com/vuestorefront/commercetools/commit/1e8fd72181b904cb70f598aec5ff3c3b28ff5592))
- add SameSite cookie
  attribute ([9a1f71f0](https://github.com/vuestorefront/commercetools/commit/9a1f71f0753643916c59c14210a6d3b90a808e3f))

### BREAKING CHANGES

- faceting no longer uses REST API but GraphQL API instead
- changed organization's name under which we release the commercetools integration from `@vue-storefront`
  to `@vsf-enterprise`

Please refer to the migration guide for more information.

## 1.4.1

- Fixed handleAfterAuth method to handle customToken scenario
  correctly ([6533](https://github.com/vuestorefront/vue-storefront/pull/6533))
  - [Rafał Dobrowolski](https://github.com/RafalDobrowolski)

## 1.4.0

- Fix UI for Click and Collect ([6276](https://github.com/vuestorefront/vue-storefront/pull/6276))
  - [Alef Barbeli](https://github.com/alefbarbeli)

- **[BREAKING]** Refactor token handling ([6329](https://github.com/vuestorefront/vue-storefront/pull/6329))
  - [Filip Sobol](https://github.com/filipsobol)

- Fix bug with wrong version UI and resolve problems with parse negative number for css calc method(after upgrading SFUI
  to 0.11.0-rc.1) ([6354](https://github.com/vuestorefront/vue-storefront/issues/6354))
  - [Rafał Dobrowolski](https://github.com/RafalDobrowolski)

- Added server access token ([6365](https://github.com/vuestorefront/vue-storefront/issues/6365))
  - [Rafał Dobrowolski](https://github.com/RafalDobrowolski)

- Add @nuxtjs/google-fonts to improve performance ([6374](https://github.com/vuestorefront/vue-storefront/pull/6374))
  - [Baroshem](https://github.com/Baroshem)

- use extractCSS rule in build to make the bundle
  smaller ([6375](https://github.com/vuestorefront/vue-storefront/pull/6375)) - [Baroshem](https://github.com/Baroshem)

- **[BREAKING]** Update GraphQL API types ([6410](https://github.com/vuestorefront/vue-storefront/pull/6410))
  - [Filip Sobol](https://github.com/filipsobol)

  | Before                                                                                                   | After                                                                                                                                 | Comment                                                                                                                                                  | Module                            |
          | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
  | Shipping address could contain `contactInfo` object with `phone`, `mobile`, `email` and `tax` properties | `phone`, `mobile`, `email` and `tax` properties should be used directly on the address object, not nested in the `contactInfo` object | In the past, the application logged a warning when `contactInfo` was present on the address object. Now we are deprecating it to match commercetools API | @vue-storefront/commercetools-api |

- Prevent cookie creation during SSR ([6442](https://github.com/vuestorefront/vue-storefront/pull/6442))
  - [Dawid Ziobro](https://github.com/dawid-ziobro)

  | Before                                                                 | After                                                                 | Comment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Module |
          | ---------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
  | Cookies for currency, locale and country were included in SSR response | Cookies for currency, locale and country are generated on client side | To prevent generating cookies during SSR (server-side rendering) and allowing caching, change in the `nuxt.config.js` file is required. Inside the `i18n` configuration, you should set the `detectBrowserLanguage` options to `false`. Then change the order of loaded modules. In the `buildModules` configuration, move the `@vue-storefront/commercetools/nuxt` module before `@vue-storefront/nuxt`. Lastly, update the Vue components used to switch locales to use the `nuxt-link` component instead of the `a` tag. By default it's located in the `StoreLocaleSelector.vue` file. | core   |

- **[BREAKING]** Update Composition API to 1.2.4 ([6452](https://github.com/vuestorefront/vue-storefront/pull/6452))
  - [Filip Sobol](https://github.com/filipsobol)

  | Before                                                                     | After                                                     | Comment                                                  | Module |
          | -------------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------- | ------ |
  | Composition API module was registered internally by Vue Storefront modules | Composition API module must be registered inside projects | Please refer to the migration guide for more information | Theme  |

## 1.3.6

- Fixed close button placement (StoreLocaleSelector)
  . ([6202](https://github.com/vuestorefront/vue-storefront/issues/6202))
  - [Łukasz Jędrasik](https://github.com/lukaszjedrasik)

- Fixed redirect to localized My Account page. ([6474](https://github.com/vuestorefront/vue-storefront/issues/6474))
  - [Łukasz Jędrasik](https://github.com/lukaszjedrasik)

## 1.3.3

- Overwrite `CategoryPageHeader` component and remove filters from
  OS ([5684](https://github.com/vuestorefront/vue-storefront/issues/5684))
  - [Łukasz Jędrasik](https://github.com/lukaszjedrasik)

- Fix bug with raising exception when visiting /checkout/payment page directly from
  url ([5983](https://github.com/vuestorefront/vue-storefront/issues/5983))
  - [Rafał Dobrowolski](https://github.com/RafalDobrowolski)

- Implemented pagination for orders history ([6032](https://github.com/vuestorefront/vue-storefront/issues/6032))
  - [Łukasz Jędrasik](https://github.com/lukaszjedrasik)

- Enable payment summary section for desktop view ([6104](https://github.com/vuestorefront/vue-storefront/pull/6104))
  - [vn-vlad](https://github.com/vn-vlad)

- Fix error thrown by the `search` method in `useProduct` composable when searching by product
  SKUs ([6181](https://github.com/vuestorefront/vue-storefront/issues/6181))
  - [Andrzej Kurek](https://github.com/Razz21)

- Fix no property error in changePassword function in useUser
  composable ([6231](https://github.com/vuestorefront/vue-storefront/issues/6231))
  - [Igor Wojciechowski](https://github.com/igorwojciechowski)

- Updated SFUI ([6240](https://github.com/vuestorefront/vue-storefront/pull/6240))
  - [Justyna Gieracka](https://github.com/justyna-13)

- Fix missing addresses data in order summary ([6282](https://github.com/vuestorefront/vue-storefront/pull/6283/))
  - [Igor Wojciechowski](https://github.com/igorwojciechowski)

- pass cookies obj with cookie names to
  mapI18nSettings ([6296](https://github.com/vuestorefront/vue-storefront/issues/6296))
  - [Marcin Sulowski](https://github.com/MarcinSulowski)

- Improve A11Y in Core Web Vitals ([6304](https://github.com/vuestorefront/vue-storefront/pull/6304))
  - [Baroshem](https://github.com/Baroshem)

- Improve SEO Core Web Vitals ([6306](https://github.com/vuestorefront/vue-storefront/pull/6306))
  - [Baroshem](https://github.com/Baroshem)

- Make VSF PWA again ([6307](https://github.com/vuestorefront/vue-storefront/pull/6307))
  - [Baroshem](https://github.com/Baroshem)

- Fix bug with redirect to home page after successful order
  placement ([6309](https://github.com/vuestorefront/vue-storefront/issues/6309))
  - [Rafał Dobrowolski](https://github.com/RafalDobrowolski)

- Fix for unsuccessful login or register message ([6311](https://github.com/vuestorefront/vue-storefront/pull/6311))
  - [Dawid Ziobro](https://github.com/dawid-ziobro)

- getProduct custom query - productType doesnt get mapped to product response in enhanceProduct
  helper ([6347](https://github.com/vuestorefront/vue-storefront/issues/6347))
  - [Marcin Sulowski](https://github.com/MarcinSulowski)

- Fix bug with wrong version UI and resolve problems with parse negative number for css calc method(after upgrading SFUI
  to 0.11.0-rc.1) ([6354](https://github.com/vuestorefront/vue-storefront/issues/6354))
  - [Rafał Dobrowolski](https://github.com/RafalDobrowolski)

- Fix `Insufficient scope` error when resetting customer's
  password ([6403_1](https://github.com/vuestorefront/vue-storefront/pull/6403))
  - [Filip Sobol](https://github.com/filipsobol)

- Allow defining custom GraphQL operations that will be called with server API
  client ([6403_2](https://github.com/vuestorefront/vue-storefront/pull/6403))
  - [Filip Sobol](https://github.com/filipsobol)

- include a copy of the product object in productResponse returned by the enhanceProduct
  helper ([6405](https://github.com/vuestorefront/vue-storefront/issues/6405))
  - [Marcin Sulowski](https://github.com/MarcinSulowski)

## 1.3.2

- **[BREAKING]** Fix loading user and cart
  information ([6265](https://github.com/vuestorefront/vue-storefront/pull/6265/))
  - [Filip Sobol](https://github.com/filipsobol)

  | Before                                                                              | After                                                                       | Comment                                                                                                                                                                                                                                                                                                                 | Module              |
          | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
  | `loadUser` was called directly inside `setup` method in `CartSidebar.vue` component | `loadUser` is called inside `onSSR` callback in `CartSidebar.vue` component | Calling `loadUser` directly inside `setup` method caused hydration issues, since cart information was not properly loaded during SSR. Additionally cart will now be automatically updated after calling `load` from the `useUser` composable, the same way as it happens when calling `logIn`, `logOut` and `register`. | commercetools theme |

- Add server-specific API client ([6321](https://github.com/vuestorefront/vue-storefront/pull/6321))
  - [Filip Sobol](https://github.com/filipsobol)

## 1.3.1

- Revert changes to Webpack configuration and Google font
  loading ([#6203](https://github.com/vuestorefront/vue-storefront/pull/6203))
  - [Filip Sobol](https://github.com/filipsobol)

## 1.3.0

- **[BREAKING]** Enable the purchase of item with selected supply channel and distribution
  channel ([#6161](https://github.com/vuestorefront/vue-storefront/pull/6161))
  - [Alef Barbeli](https://github.com/alefbarbeli)

  | Before                                                                                                                                                   | After                                                                                                                                                                                                                                                                                     | Comment                                                                                                                                           | Module     |
          | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
  | the addToCart method has the signature addToCart ({ id, version }: CartDetails, product: ProductVariant, quantity: number): Promise&lt;CartResponse&gt;; | now the addToCart method was change to enable the supply and distribution channels with the signature addToCart ({ id, version }: CartDetails, params: { product: ProductVariant; quantity: number; supplyChannel?: string; distributionChannel?: string;}): Promise&lt;CartResponse&gt;; | The composable was changed to match this signature. The changes from Click & Collect / MultiStore are required to use this feature on Product.vue | api-client |

- Added missing mobile menu to CT ([#6184](https://github.com/vuestorefront/vue-storefront/pull/6184))
  - [Łukasz Jędrasik](https://github.com/lukaszjedrasik)

- Added customQuery support for useUser factory
  params ([#5883](https://github.com/vuestorefront/vue-storefront/pull/5823)) - [vn-vlad](https://github.com/vn-vlad)

- Fix locale links in core and commercetools
  integration ([#5886](https://github.com/vuestorefront/vue-storefront/issues/5886))
  - [Baroshem](https://github.com/Baroshem)

- Remove SSR from personalized elements ([#5925](https://github.com/vuestorefront/vue-storefront/pull/5925))
  - [vn-vlad](https://github.com/vn-vlad)

- Add "useStore" implementation and plugin for creating locale, currency and country
  cookies ([#5945](https://github.com/vuestorefront/vue-storefront/pull/5945)) - [vn-vlad](https://github.com/vn-vlad)

- Add forgot password functionality ([#5968](https://github.com/vuestorefront/vue-storefront/issues/5968))
  - [Baroshem](https://github.com/Baroshem)

- Click "Add New Address" button on the Checkout does not submit the
  form ([#5994](https://github.com/vuestorefront/vue-storefront/pull/6034))
  - [lukaszjedrasik](https://github.com/lukaszjedrasik)

- Remove `generate` command from `package.json` ([#6035](https://github.com/vuestorefront/vue-storefront/pull/6035))
  - [lukaszjedrasik](https://github.com/lukaszjedrasik)

- Refactor updateCart, fix retry logic in case of mismatch of
  cart ([#6050](https://github.com/vuestorefront/vue-storefront/pull/6054))
  - [git-antonyuk](https://github.com/git-antonyuk)

- **[BREAKING]** refactor(commercetools): fix the frontend client bundling the commercetools-sdk and apollo
  client ([#6066](https://github.com/vuestorefront/vue-storefront/pull/6066)) - [bloodf](https://github.com/bloodf)

  | Before                                                                    | After                                                             | Comment                                                                            | Module     |
          | ------------------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------- |
  | the "createCommerceToolsConnection" were being exported by the api-client | the "createCommerceToolsConnection" is not being exported anymore | to use the current connection, you will need to access the context to call the API | api-client |

- Linked banner grids buttons on homepage ([#6070](https://github.com/vuestorefront/vue-storefront/pull/6070))
  - [Justyna Gieracka](https://github.com/justyna-13)

- Replace mocked email address in MyProfile password change tab to active user
  email ([#6079](https://github.com/vuestorefront/vue-storefront/pull/6079))
  - [Adam Pawliński](https://github.com/AdamPawlinski)

- Removed hardcoded link to category in
  SearchResults.vue ([#6081](https://github.com/vuestorefront/vue-storefront/pull/6081))
  - [Justyna Gieracka](https://github.com/justyna-13)

- Added new product getter `getProductSku` ([#6107](https://github.com/vuestorefront/vue-storefront/pull/6107))
  - [Justyna Gieracka](https://github.com/justyna-13)

- Smartphone only promo code input added ([#6112](https://github.com/vuestorefront/vue-storefront/pull/6112))
  - [vn-vlad](https://github.com/vn-vlad)

- Updates form validation scheme for street, number and city in the checkout and profile editing
  pages ([#6122](https://github.com/vuestorefront/vue-storefront/pull/6122))
  - [Heitor Ramon Ribeiro](https://github.com/bloodf)

- **[BREAKING]** updated the removeCoupon interface to match the
  applyCoupon ([#6126](https://github.com/vuestorefront/vue-storefront/pull/6126))
  - [Heitor Ramon Ribeiro](https://github.com/bloodf)

  | Before                                                                                                                    | After                                                                                    | Comment                                                                           | Module      |
          | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------- |
  | the useCart composable method removeCoupon was using this call signature: ({ coupon: COUPON, customQuery?: CustomQuery }) | the method signature was changed to: ({ couponCode: string, customQuery?: CustomQuery }) | on each removeCoupon composable usage need to change the "coupon" to "couponCode" | composables |

- Add new getter for orders total and change return value of
  searchOrders ([#6132](https://github.com/vuestorefront/vue-storefront/issues/5968))
  - [Baroshem](https://github.com/Baroshem)

- Phone number validation via awesome-phonenumber ([#5951](https://github.com/vuestorefront/vue-storefront/issues/5951))
  - [Fifciu](https://github.com/Fifciu)

## 1.2.3

- Use cookies to read information about i18n ([#5919](https://github.com/vuestorefront/vue-storefront/pull/5919))
  - [andrzejewsky](https://github.com/andrzejewsky)

- Resetting commercetools token when clearing user
  session ([#5920](https://github.com/vuestorefront/vue-storefront/pull/5920))
  - [andrzejewsky](https://github.com/andrzejewsky)

- Fix calculation of cart totals ([#5932](https://github.com/vuestorefront/vue-storefront/pull/5932))
  - [Filip Sobol](https://github.com/filipsobol)

## 1.2.2

- Allow searching by orderNumber ([#5858](https://github.com/vuestorefront/vue-storefront/pull/5858))
  - [samriley](https://github.com/samriley)

## 1.2.1

- Add args parameter to custom queries ([#5854](https://github.com/vuestorefront/vue-storefront/issues/5854))
  - [andrzejewsky](https://github.com/andrzejewsky)

- Export factory params for all composables to allow
  overriding ([#5862](https://github.com/vuestorefront/vue-storefront/pull/5862))
  - [Filip Sobol](https://github.com/filipsobol)

- Export helper Apollo Link functions for easier
  overriding ([#5873](https://github.com/vuestorefront/vue-storefront/pull/5873))
  - [Filip Sobol](https://github.com/filipsobol)

## 1.2.0

- Set 'vsf-commercetools-token' cookie expiration time to match token expiration
  time. ([#5774](https://github.com/vuestorefront/vue-storefront/pull/5774))
  - [Filip Sobol](https://github.com/filipsobol)

- Reduce payload size for cart methods ([#5836](https://github.com/vuestorefront/vue-storefront/pull/5836))
  - [Filip Sobol](https://github.com/filipsobol)

## 1.2.0-rc.3

- Fix getters in `cartGetters` to not throw errors when some properties don't
  exist ([#5699](https://github.com/vuestorefront/vue-storefront/pull/5699))
  - [Filip Sobol](https://github.com/filipsobol)

- Fixed mapping for product attributes with
  type `set` ([#5708](https://github.com/vuestorefront/vue-storefront/pull/5708))
  - [Filip Sobol](https://github.com/filipsobol)

- Fixed CT wishlist throwing CAPI error ([#5716](https://github.com/vuestorefront/vue-storefront/pull/5716))
  - [Filip Sobol](https://github.com/filipsobol)

## 1.2.0-rc.2

- Adjust Checkout UI ([#5343](https://github.com/vuestorefront/vue-storefront/issues/5343))
  - [Justyna Gieracka](https://github.com/justyna-13)

- **[BREAKING]** Usage of api middleware ([#5361](https://github.com/vuestorefront/vue-storefront/pull/5361))
  - [Patryk Andrzejewski](https://github.com/andrzejewsky)

  | Before         | After                | Comment                                                               | Module        |
          | -------------- | -------------------- | --------------------------------------------------------------------- | ------------- |
  | one entrypoint | multiple entrypoints | We expose multiple entrypoints for server and client side interaction | commercetools |

- New part of checkout - shipping details, inside core and
  commercetools ([#5419](https://github.com/vuestorefront/vue-storefront/pull/5552))
  - [Fifciu](https://github.com/Fifciu)

- Added `is-authenticated` middleware to protect user profile routes from guest
  access ([#5442](https://github.com/vuestorefront/vue-storefront/pull/5442))
  - [Filip Sobol](https://github.com/filipsobol)

- Improvements for api middleware ([#5500](https://github.com/vuestorefront/vue-storefront/pull/5500))
  - [Patryk Andrzejewski](https://github.com/andrzejewsky)

- **[BREAKING]** New part of checkout - Billing details, inside core and
  commercetools ([#5552](https://github.com/vuestorefront/vue-storefront/pull/5552))
  - [Fifciu](https://github.com/Fifciu)

  | Before                            | After                                          | Comment                                         | Module              |
          | --------------------------------- | ---------------------------------------------- | ----------------------------------------------- | ------------------- |
  | UserBillingAddress works properly | New API inside Checkout/UserBillingAddress.vue | Customized components to work with new checkout | commercetools-theme |

- **[BREAKING]** Quick search ([#5566](https://github.com/vuestorefront/vue-storefront/issues/5566))
  - [Justyna Gieracka](https://github.com/justyna-13)

  | Before                                     | After                               | Comment                                        | Module                 |
          | ------------------------------------------ | ----------------------------------- | ---------------------------------------------- | ---------------------- |
  | { changeSearchTerm } = useUiHelpers()      | { setTermForUrl } = useUiHelpers(); | Changed changeSearchTerm name to setTermForUrl | useUiHelpers/index.ts, |
  | { getSearchTermFromUrl } = useUiHelpers(); | Created new function                | useUiHelpers/index.ts                          |

- **[BREAKING]** Implementation of api middleware ([#5577](https://github.com/vuestorefront/vue-storefront/pull/5577))
  - [Patryk Andrzejewski](https://github.com/andrzejewsky)

| Before                             | After                             | Comment                                                                                              | Module        |
| ---------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------- |
| customQuery was used as a function | customQuery is a key-value object | The key is a query name, value is the name of a new query function, defined in the middleware config | commercetools |

- **[BREAKING]** New Payment API for Checkout ([#5587](https://github.com/vuestorefront/vue-storefront/pull/5587))
  - [Fifciu](https://github.com/Fifciu)

  | Before                                  | After                                                              | Comment   | Module        |
          | --------------------------------------- | ------------------------------------------------------------------ | --------- | ------------- |
  | Dedicated composable for whole checkout | Dedicated composable for Shipping, Billing and Provider components | undefined | commercetools |

- State as a select field at both Checkout and MyAccount (shipping & billing). Support for freeAbove in shipping
  methods ([#5628](https://github.com/vuestorefront/vue-storefront/pull/5628)) - [Fifciu](https://github.com/Fifciu)

## 1.1.7

- fixed error with login to the account ([#5613](https://github.com/vuestorefront/vue-storefront/issues/5613))

## 1.1.6

- fix register function from CT useUser composable allows user to log
  in [#5613](https://github.com/vuestorefront/vue-storefront/issues/5613)

## 1.1.5

- remove deprecated field `description` from shipping methods
  query [#5614](https://github.com/vuestorefront/vue-storefront/issues/5614)

## 1.1.6

- fix register function from CT useUser composable allows user to log
  in [#5613](https://github.com/vuestorefront/vue-storefront/issues/5613)

## 1.1.5

- remove deprecated field `description` from shipping methods
  query [#5614](https://github.com/vuestorefront/vue-storefront/issues/5614)

## 1.1.3

- cover errors in re-try apollo-link that are not comming from
  graphql ([#5548](https://github.com/vuestorefront/vue-storefront/pull/5548))

## 1.1.2

- moved from using `attributesList` to `attributesRaw`
- add 'once' to prevent font reload on each reactivity
  event ([#5513](https://github.com/vuestorefront/vue-storefront/issues/5534))

## 1.1.1

- fixed `vue-lazy-hydration` dependency
  in `nuxt-theme-module` ([#5406](https://github.com/vuestorefront/vue-storefront/issues/5406))

## 1.1.0

- fix getOrders api ([#5328](https://github.com/vuestorefront/vue-storefront/issues/5328))
- added bottom margin to fix visibility of last footer
  category ([#5253](https://github.com/vuestorefront/vue-storefront/issues/5253))
- **[BREAKING]** refactored names of many factory methods and composable methods, details in linked
  PR ([#5299](https://github.com/vuestorefront/vue-storefront/pull/5299))
- **[BREAKING]** changed signatures of factory methods to always 2 arguments, details in linked
  PR ([#5299](https://github.com/vuestorefront/vue-storefront/pull/5299))
- **[BREAKING]** removed `totalOrders`
  and `totalProducts` ([#5330](https://github.com/vuestorefront/vue-storefront/pull/5330))
- removed `formatPrice` from `useUiHelpers`, replaced by vue18n `$n`
  function ([#5339](https://github.com/vuestorefront/vue-storefront/pull/5339))
- added missing `i18n` tags ([#5337](https://github.com/vuestorefront/vue-storefront/issues/5337))
- use updated factories `useUserBillingFactory`, `useUserShippingFactory`
  and `useWishlistFactory` ([5350](https://github.com/vuestorefront/vue-storefront/pull/5350))
- use updated factories `useUserBillingFactory`, `useUserShippingFactory`
  and `useWishlistFactory` ([5350](https://github.com/vuestorefront/vue-storefront/pull/5350))
- fix selecting country on checkout payment and
  shipping ([5386](https://github.com/vuestorefront/vue-storefront/pull/5386))
- `createMyShoppingList` as a restricted anonymous operation

## 1.0.1-rc.1

- updated version of core

## 1.0.0-rc.1

- removed `availableFilters` and `availableSortingOptions`
  from `useProduct` ([#4856](https://github.com/vuestorefront/vue-storefront/issues/4856))
- removed `@import "~@storefront-ui/vue/styles";` from all components, because SFUI variables and mixins are now
  available globally and imports will drastically increase bundle
  size ([#5195](https://github.com/vuestorefront/vue-storefront/issues/5195))
- enabled "modern mode" in `yarn build` command ([#5203](https://github.com/vuestorefront/vue-storefront/issues/5203))
- added missing order getter to get item price ([#5231](https://github.com/vuestorefront/vue-storefront/issues/5231))
- retry updating the cart with new version if previous request failed due to a version
  mismatch ([#5264](https://github.com/vuestorefront/vue-storefront/issues/5264))
- removed logging level from nuxt.config.js to use defaults from
  core ([#5304](https://github.com/vuestorefront/vue-storefront/issues/5304))
- fixed broken focus in login form ([#5273](https://github.com/vuestorefront/vue-storefront/issues/5273))
- fixed select for changing variant on product
  page ([#5281](https://github.com/vuestorefront/vue-storefront/issues/5281))
- added token re-try strategy ([#5295](https://github.com/vuestorefront/vue-storefront/pull/5295))
- added discounts api getter ([#5154](https://github.com/vuestorefront/vue-storefront/pull/5154))
- added context implementation ([#5218](https://github.com/vuestorefront/vue-storefront/pull/5218))
- added context typings ([5290](https://github.com/vuestorefront/vue-storefront/pull/5290))

## 0.2.6

- fix errors throw by some product getters ([#5089](https://github.com/vuestorefront/vue-storefront/issues/5089))
- The address `contactInfo` field is deprecated in the CT api. We have added support for the contact information fields
  directly in the address and will now show a warning when deprecated field is
  used ([#5083](https://github.com/vuestorefront/vue-storefront/pull/5083))
- removed `chosenShippingMethod` defaulting ([#5073](https://github.com/vuestorefront/vue-storefront/issues/5073))
- fix `useCheckout` - set loading fields to false when api-client
  throws ([#5096](https://github.com/vuestorefront/vue-storefront/pull/5096))

## 0.2.5

- `customQuery` for checkout composables ([#5025](https://github.com/vuestorefront/vue-storefront/issues/5025))
- api-client apollo client no longer shared between
  requests ([#5056](https://github.com/vuestorefront/vue-storefront/pull/5056))

## 0.2.4

- Remove defaulting for checkout shipping details ([#5026](https://github.com/vuestorefront/vue-storefront/issues/5026))

### Changes

- added `getTotalReviews` and `getAverageRating`
  to `productGetters` ([#4958](https://github.com/vuestorefront/vue-storefront/issues/4958))
- added '\_rating' back to the product ([#4958](https://github.com/vuestorefront/vue-storefront/issues/4958))
- added mock for user shipping addresses in MyShippingDetails and Checkout's
  Shipping ([#4841](https://github.com/vuestorefront/vue-storefront/issues/4841))

## 0.2.3

### Changes

- adding ability to overriding `isTokenUserSession` check in
  api-client ([#4959](https://github.com/vuestorefront/vue-storefront/issues/4959))

## 0.2.2

### Breaking changes

- removed '\_rating' from product ([#4906](https://github.com/vuestorefront/vue-storefront/issues/4906))

### Changes

- Fix types for CT api-client and composables
  packages ([#4924](https://github.com/vuestorefront/vue-storefront/pull/4924))
- fixed updateUser on useUser composable ([#4863](https://github.com/vuestorefront/vue-storefront/issues/4863))
- implemented useReviews on product page ([#4800](https://github.com/vuestorefront/vue-storefront/issues/4800))
- implemented faceting using useFacet factory ([#4853](https://github.com/vuestorefront/vue-storefront/issues/4853))
- fixed anonymous token loading ([#4917](https://github.com/vuestorefront/vue-storefront/issues/4917))
- fixed bugs related to customQuery ([#4933](https://github.com/vuestorefront/vue-storefront/issues/4933)
  , [#4913](https://github.com/vuestorefront/vue-storefront/issues/4913))

## 0.1.0

- refactored setup using apiClientFactory ([#4777](https://github.com/vuestorefront/vue-storefront/issues/4777))

# Change Log
