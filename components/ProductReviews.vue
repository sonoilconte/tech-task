<template>
  <div class="product-reviews">
    <SfReview
      v-for="review in productReviews"
      :key="reviewGetters.getReviewId(review)"
      :author="reviewGetters.getReviewAuthor(review)"
      :date="reviewGetters.getReviewDate(review)"
      :message="reviewGetters.getReviewMessage(review)"
      :max-rating="5"
      :rating="reviewGetters.getReviewRating(review)"
      :char-limit="250"
      :read-more-text="$t('Read more')"
      :hide-full-text="$t('Read less')"
    />
    <div
      class="product-reviews__pagination"
      v-if="isPaginationVisible"
    >
      <SfArrow
        :aria-label="$t('prev')"
        class="sf-arrow--left sf-arrow--transparent"
        :disabled="disabledPage('prev')"
        @click="changePage(offset - limit)"
      />
      <div class="product-reviews__count">
        {{ fromTo }}
        <strong>{{ $t('of') }}</strong>
        {{ totalReviews }}
      </div>
      <SfArrow
        :aria-label="$t('next')"
        class="sf-arrow--right sf-arrow--transparent"
        :disabled="disabledPage('next')"
        @click="changePage(offset + limit)"
      />
    </div>
    <p v-if="!hasReviews">
      {{ $t('There\'s no reviews yet for this product. You can add the first one!') }}
    </p>
    <ProductAddReviewForm />
  </div>
</template>

<script>
import { computed, useRoute } from '@nuxtjs/composition-api';
import {
  SfArrow,
  SfReview
} from '@storefront-ui/vue';
import {
  useReview,
  useProduct,
  reviewGetters,
  productGetters
} from '@vsf-enterprise/commercetools';
import ProductAddReviewForm from '~/components/ProductAddReviewForm';

export default {
  name: 'ProductReviews',
  components: {
    SfArrow,
    SfReview,
    ProductAddReviewForm
  },
  setup(_, { emit }) {
    const route = useRoute();
    const { reviews, search: searchReviews } = useReview('productReviews');
    const { products } = useProduct('products');
    const productReviews = computed(() => reviews.value?.results ?? []);
    const hasReviews = computed(() => reviews.value?.results?.length > 0);
    const offset = computed(() => reviews.value?.offset ?? 0);
    const product = computed(() => productGetters.getFiltered(products.value, { skus: [route.value.params.sku] })[0]);
    const totalReviews = computed(() => productGetters.getTotalReviews(product.value));
    const isPaginationVisible = computed(() => productReviews.value.length < totalReviews.value);
    const fromTo = computed(() =>
      `${productReviews.value.length > 1 ? `${offset.value + 1} - ` : ''} ${offset.value + productReviews.value.length}`
    );
    const limit = 10;

    const changePage = async (calculatedOffset) => {
      await searchReviews({ limit, offset: calculatedOffset, productId: product.value._id, sort: 'createdAt desc' });
      emit('scrollTo');
    };
    const disabledPage = (direction) => {
      if (direction === 'prev') {
        return offset.value === 0;
      }
      return (offset.value + productReviews.value.length) >= totalReviews.value;
    };

    return {
      productReviews,
      reviewGetters,
      totalReviews,
      fromTo,
      isPaginationVisible,
      disabledPage,
      offset,
      limit,
      hasReviews,
      changePage
    };
  }
};
</script>

<style lang="scss" scoped>
  .product-reviews {
    border-bottom: var(--c-light) solid 1px;
    margin-bottom: var(--spacer-base);
    &__pagination {
      padding: 24px 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &__count {
      padding: 0 var(--spacer-base);
    }
  }
</style>
