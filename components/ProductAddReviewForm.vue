<template>
  <div v-if="reviewSent && !error.addReview">
    <p>{{ $t('Thank you for submitting your review!') }}</p>
  </div>
  <div v-else>
    <SfHeading
      :level="3"
      :title="$t('Add your review')"
      class="sf-heading--left sf-heading--no-underline"
    />
    <form
      class="form"
      @submit.prevent="handleAddReviewForm"
    >
      <SfInput
        v-model="form.authorName"
        :label="$t('Author')"
        name="authorName"
        class="form__element"
        required
      />
      <SfSelect
        v-model="form.rating"
        :label="$t('Rating')"
        name="rating"
        class="form__element form__element--half form__element--half-even form__select sf-select--underlined"
        required
      >
        <SfSelectOption
          v-for="value in ratingValues"
          :key="value"
          :value="value"
        >
          {{ value }}
        </SfSelectOption>
      </SfSelect>
      <SfTextarea
        v-model="form.text"
        name="text"
        :label="$t('Review')"
        class="form__element"
        :rows="10"
        required
      />
      <SfButton
        type="submit"
        class="form__button"
        :disabled="loading"
      >
        <SfLoader :class="{ loader: loading }" :loading="loading">
          <div>{{ $t('Add review') }}</div>
        </SfLoader>
      </SfButton>
    </form>
  </div>
</template>

<script>
import { computed, ref, useContext, useRoute, watch } from '@nuxtjs/composition-api';
import { productGetters, useProduct, useReview, userGetters, useUser } from '@vsf-enterprise/commercetools';
import {
  SfSelect,
  SfButton,
  SfInput,
  SfLoader,
  SfTextarea,
  SfHeading
} from '@storefront-ui/vue';
import { useUiNotification } from '~/composables';

export default {
  name: 'ProductAddReviewForm',
  components: {
    SfButton,
    SfInput,
    SfLoader,
    SfSelect,
    SfTextarea,
    SfHeading
  },
  setup() {
    const { app: { i18n } } = useContext();
    const route = useRoute();
    const { send } = useUiNotification();
    const { products, search } = useProduct('products');
    const { error, addReview, loading } = useReview('productReviews');
    const { user } = useUser();

    const limit = 10;
    const form = ref({});
    const reviewSent = ref(false);
    const product = computed(() => productGetters.getFiltered(products.value, { skus: [route.value.params.sku] })[0]);
    const setAuthorName = () => form.value.authorName = userGetters.getFullName(user.value);
    const handleAddReviewForm = async () => {
      await addReview({
        productId: product.value._id,
        draft: {
          ...form.value,
          rating: parseInt(form.value.rating)
        },
        sort: 'createdAt desc',
        limit
      });
      await search({ skus: [route.value.params.sku] });

      if (!error.value.addReview) {
        send({ type: 'success', message: i18n.t('Review has been added') });
        reviewSent.value = true;
      }
    };

    setAuthorName();

    watch(user, () => setAuthorName());

    return {
      form,
      handleAddReviewForm,
      loading,
      reviewSent,
      error,
      ratingValues: [1, 2, 3, 4, 5]
    };
  }
};
</script>

<style lang="scss" scoped>
.form {
  margin-bottom: var(--spacer-xl);
  .sf-button {
    --button-width: 100%;
    @include for-desktop {
      --button-width: auto;
    }
  }
}
.sf-select,
.sf-textarea {
  margin-bottom: var(--spacer-base);
  ::v-deep textarea {
    --textarea-width: 100%;
    --textarea-resize: vertical;
    box-sizing: border-box;
  }
}
</style>
