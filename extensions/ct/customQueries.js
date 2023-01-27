const gql = require('graphql-tag');
const { ChannelFragment } = require('@vsf-enterprise/commercetools-api');
const { optimizeQuery } = require('../helpers');

const getProductProjectionSearch = `${ChannelFragment}
fragment DefaultProductPriceSearch on ProductPriceSearch {
  discounted {
    value {
      type
      currencyCode
      centAmount
      fractionDigits
    }
    discount {
      validFrom
      validUntil
      isActive
      name(acceptLanguage: $acceptLanguage)
    }
  }
  value {
    type
    currencyCode
    centAmount
    fractionDigits
  }
}
fragment ImagesProductSearch on ProductSearchVariant {
  images {
    url
    label
  }
}
fragment PriceProductSearch on ProductSearchVariant {
  price(currency: $currency, country: $country, channelId: $channelId) {
    ...DefaultProductPriceSearch
  }
}

fragment AvailabilityProductSearch on ProductSearchVariant {
  availability {
    noChannel {
      isOnStock
      restockableInDays
      availableQuantity
    }
    channels(
      includeChannelIds: $includeChannelIds
      excludeChannelIds: $excludeChannelIds
      limit: $channelLimit
      offset: $channelOffset
    ) {
      limit
      offset
      total
      results {
        channelRef {
          id
        }
        availability {
          isOnStock
          restockableInDays
          availableQuantity
        }
        channel {
          ...ChannelFragment
        }
      }
    }
  }
}
fragment DefaultVariantProductSearch on ProductSearchVariant {
  id
  sku
  ...ImagesProductSearch
  ...PriceProductSearch
  ...AvailabilityProductSearch
}
query productProjectionsSearch(
  $sorts: [String!],
  $limit: Int,
  $offset: Int,
  $locale: Locale!,
  $acceptLanguage: [Locale!],
  $text: String,
  $facets: [SearchFacetInput!],
  $filters: [SearchFilterInput!],
  $queryFilters: [SearchFilterInput!],
  $facetFilters: [SearchFilterInput!],
  $currency: Currency!,
  $country: Country,
  $channelId: String,
  $includeChannelIds: [String!],
  $excludeChannelIds:[String!],
  $channelLimit: Int,
  $channelOffset: Int
) {
  productProjectionSearch(
    sorts: $sorts,
    limit: $limit,
    offset: $offset,
    locale: $locale,
    text: $text,
    facets: $facets
    filters: $filters,
    queryFilters: $queryFilters,
    facetFilters: $facetFilters
  ) {
    count
    total
    offset
    results {
      id
      slug(acceptLanguage: $acceptLanguage)
      name(acceptLanguage: $acceptLanguage)
      masterVariant {
        ...DefaultVariantProductSearch
      }
      reviewRatingStatistics {
        averageRating,
        ratingsDistribution,
        count
      }
    }
    facets {
      facet,
      value {
        ... on TermsFacetResult {
          terms {
            term
            count
            productCount
          }
        }
      }
    }
  }
}
`;

module.exports.getFacetProductProjectionQuery = gql`
  ${optimizeQuery(getProductProjectionSearch)}
`;

