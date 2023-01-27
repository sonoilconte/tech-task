<template>
  <div class="product-loader">
    <slot />
    <transition name="sf-fade" mode="out-in">
      <SfLoader v-if="loading" class="product-loader__spinner" />
    </transition>
  </div>
</template>

<script>
import { SfLoader } from '@storefront-ui/vue';

export default {
  name: 'ProductLoader',
  components: {
    SfLoader
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.product-loader {
  position: relative;
  &__spinner {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
    .sf-loader__overlay {
      background: rgba(255,255,255,.6);
    }
  }
}
</style>
