<template>
  <div
    class="sf-store"
    :class="{ active }"
  >
    <slot name="distance">
      <div
        v-if="distance"
        class="sf-store__distance"
      >
          <span class="sf-store__kilometers">
            {{ `${distance.value}${distance.unit}` }}
          </span>
          <span>{{ $t('away') }}</span>
      </div>
    </slot>
    <slot name="media">
      <div
        :class="{ 'sf-store__media': picture }"
      >
        <SfImage
          v-if="picture"
          :src="picture"
          :alt="`${name} ${$t('picture')}`"
          :width="82"
          :height="112"
          image-tag="nuxt-img"
          :nuxt-img-config="{
            format: 'webp',
            fit: 'fill'
          }"
        />
        <SfIcon v-else icon="marker" class="sf-store__icon" />
      </div>
    </slot>
    <div class="sf-store__info">
      <div class="sf-store__heading">
        <slot name="heading">
          <div class="sf-store__name">
            {{ name }}
          </div>
        </slot>
      </div>
      <slot>
        <SfCharacteristic
          v-if="addressLine"
          icon="marker"
          size-icon="16px"
          class="sf-store__property"
        >
          <template #text>
            {{ addressLine }}
          </template>
        </SfCharacteristic>
        <SfCharacteristic
          v-if="phone"
          icon="phone"
          size-icon="16px"
          class="sf-store__property"
        >
          <template #text>
            <a
              v-focus
              :href="`tel:${phone}`"
              tabindex="0"
              class="sf-store__property-link"
            >{{ phone }}</a
            >
          </template>
        </SfCharacteristic>
        <SfCharacteristic
          v-if="email"
          icon="mail"
          size-icon="16px"
          class="sf-store__property"
        >
          <template #text>
            <a
              v-focus
              :href="`mailto:${email}`"
              tabindex="0"
              class="sf-store__property-link"
            >{{ email }}</a
            >
          </template>
        </SfCharacteristic>
        <SfCharacteristic
          v-if="enabledHours"
          icon="clock"
          size-icon="16px"
          class="sf-store__property"
        >
          <template #text>
            {{ enabledHours }}
          </template>
        </SfCharacteristic>
        <SfCharacteristic
          v-if="description"
          icon="info"
          size-icon="16px"
          class="sf-store__property"
        >
          <template #text>
            {{ description }}
          </template>
        </SfCharacteristic>
      </slot>
    </div>
    <SfButton
      v-if="buttonEnabled"
      class="sf-store__pick-store"
      :class="{ 'color-danger': active }"
      @click="pickStore"
    >
      {{ active ? $t('Remove') : buttonText }}
    </SfButton>
  </div>
</template>

<script>
import {
  SfButton,
  SfCharacteristic,
  SfIcon,
  SfImage
} from '@storefront-ui/vue';
import { computed } from '@nuxtjs/composition-api';

export default {
  name: 'StoreComponent',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    distance: {
      type: Object,
      required: false
    },
    openingHours: {
      type: Object,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    name: {
      type: String,
      default: ''
    },
    picture: {
      type: String,
      default: null
    },
    addressLine: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null
    },
    buttonText: {
      type: String,
      default: function() {
        return this.$t('Pick this store');
      }
    },
    buttonEnabled: {
      type: Boolean,
      default: true
    }
  },
  components: {
    SfButton,
    SfCharacteristic,
    SfIcon,
    SfImage
  },
  setup(props, { root, emit }) {
    const { locales, locale } = root.$i18n;
    const enabledHours = computed(() => {
      return (props.openingHours && props.openingHours[locale])
        ? props.openingHours[locale]
        : null;
    });

    return {
      pickStore: () => props.active ? emit('clear') : emit('click'),
      locale,
      locales,
      enabledHours
    };
  }
};
</script>

<style lang="scss" scoped>
// original styles from SFUI
.sf-store {
  display: flex;
  flex-wrap: wrap;
  padding: var(--store-padding, 0 0 var(--spacer-sm) 0);
  margin: var(--store-margin, var(--spacer-sm) 0 0 0);
  @include border(--store-border, 0 0 1px 0, solid, var(--c-light));
  &__distance {
    flex: var(--store-distance-flex, 0 0 100%);
    order: var(--store-distance-order);
    margin: var(--store-distance-margin, 0 0 var(--spacer-xs) 0);
    text-align: var(--store-distance-text-align, left);
    color: var(--c-text);
    @include font(
        --store-item-distance-font,
        var(--font-weight--normal),
        var(--font-size--base),
        1.4,
        var(--font-family--secondary)
    );
    span {
      font-weight: var(--store-distance-span, var(--font-weight--normal));
      color: var(--c-text);
    }
  }
  &__btn {
    display: flex;
    justify-content: flex-start;
  }
  &__media {
    flex: var(--store-media-flex, 0 0 5.125rem);
    margin: var(--store-media-margin, 0 var(--spacer-xs) 0 0);
  }
  &__icon {
    margin: var(--store-icon-padding, var(--spacer-xl))
  }
  &__address {
    margin: var(--store-item-addres-margin, 0 0 var(--spacer-base) 0);
    color: var(--c-link);
    @include font(
        --store-item-property-font,
        var(--font-weight--normal),
        var(--font-size--base),
        1.4,
        var(--font-family--primary)
    );
  }
  &__name {
    margin: var(--store-item-name-margin, 0);
    color: var(--store-item-name-color, var(--c-text));
    @include font(
        --store-item-property-font,
        var(--font-weight--normal),
        var(--font-size--base),
        1.4,
        var(--font-family--secondary)
    );
  }
  &__property {
    display: flex;
    align-items: center;
    margin: var(--store-item-property-margin, 0 0 var(--spacer-sm) 0);
    color: var(--c-dark-variant);
    @include font(
        --store-item-property-font,
        var(--font-weight--medium),
        var(--font-size--xs),
        1.4,
        var(--font-family--secondary)
    );
    &:last-child {
      margin: var(--store-item-property-margin, 0);
    }
  }
  &__property-link {
    color: var(--c-link);
    text-decoration: none;
  }
  @include for-desktop {
    --store-distance-flex: 1 0 0;
    --store-distance-order: 1;
    --store-distance-margin: 0 0 0 0;
    --store-distance-text-align: right;
    --store-padding: 0 0 var(--spacer-2xs) 0;
  }
}

// custom styles
.sf-store {
  --image-width: 82px;
  --image-height: 112px;
  justify-content: space-between;
  flex-wrap: wrap;
  order: 2;
  margin: 0;

  @include for-desktop {
    flex-wrap: nowrap;
  }

  .sf-image--wrapper {
    display: block;
    ::v-deep .sf-image-loaded {
      display: inline-block;
    }
  }
  &.active {
    order: 1;
  }
  &__name {
    margin-bottom: var(--spacer-sm);
  }
  &__distance {
    display: flex;
    justify-content: flex-end;
    margin: var(--spacer-sm) 0 0;
  }
  &__kilometers {
    font-weight: var(--font-weight--semibold);;
  }
  &__info {
    margin-left: 0;
    flex-grow: 1;
    width: 60%;
  }
  &__pick-store {
    height: 3rem;
    padding: var(--spacer-xs) var(--spacer-sm);
    @include for-mobile {
      width: 100%;
      margin-top: var(--spacer-base);
    }
  }
  @include for-desktop {
    &__distance {
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      margin: 0;
    }
    &__kilometers {
      font-weight: var(--font-weight--normal);
    }
    &__button {
      width: fit-content;
      margin: 0 0 var(--spacer-sm);
    }
  }
}
</style>
