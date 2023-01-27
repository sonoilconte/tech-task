<template>
  <div>
    <div class="highlighted">
      <SfHeading
        :level="3"
        :title="$t('Order summary')"
        class="sf-heading--left sf-heading--no-underline title"
      />
    </div>
    <div v-e2e="'cart-preview-summary'" class="highlighted">
      <SfProperty
        :name="$t('Products')"
        :value="totalItems"
        class="sf-property--full-width sf-property--large property"
      />
      <SfProperty
        :name="$t('Subtotal')"
        :value="getCartPrice(totals.subtotal, true)"
        :class="[
          'sf-property--full-width',
          'sf-property--large property',
          { discounted: hasSpecialPrice }
        ]"
      />
      <div class="discounts">
        <SfProperty
          v-for="discount in discounts"
          :key="discount.id"
          :name="discount.name"
          :value="'-' + getCartPrice(discount.value)"
          class="sf-property--full-width sf-property--small discount"
        />
      </div>
      <SfProperty
        v-if="hasSpecialPrice"
        :value="getCartPrice(totals.special, true)"
        class="sf-property--full-width sf-property--small property special-price"
      />
      <SfProperty
        :name="$t('Shipping')"
        :value="
          getCartPrice(
            getShippingMethodPrice(selectedShippingMethod, totals.special),
            true
          )
        "
        class="sf-property--full-width sf-property--large property"
      />
      <SfProperty
        :name="$t('Total')"
        :value="getCartPrice(totals.total, true)"
        class="sf-property--full-width sf-property--large property-total"
      />
    </div>
    <div class="highlighted">
      <div class="coupons">
        <SfProperty
          v-for="coupon in coupons"
          :key="coupon.id"
          :name="coupon.name"
          class="sf-property--full-width sf-property--small coupon"
          :class="{ 'coupon--invalid': !coupon.valid }"
        >
          <template #value>
            <SfButton
              class="sf-button--text"
              style="margin: 0 0 1rem auto; display: block"
              @click="removeCartCoupon({ couponCode: coupon.code })"
            >
              {{ $t('Remove coupon') }}
            </SfButton>
          </template>
        </SfProperty>
      </div>
      <div class="promo-code">
        <SfInput
          :value="promoCode"
          @input="onPromoCodeInput"
          @keydown.enter="applyCartCoupon"
          name="promoCode"
          :label="$t('Enter promo code')"
          class="sf-input--filled promo-code__input"
          :valid="!cartError.applyCoupon"
          :errorMessage="$t('This promo code is invalid')"
        />
        <SfButton
          class="promo-code__button"
          :aria-label="$t('Apply coupon')"
          @click="applyCartCoupon"
        >
          {{ $t('Apply') }}
        </SfButton>
      </div>
    </div>
    <div class="highlighted">
      <SfCharacteristic
        v-for="characteristic in characteristics"
        :key="characteristic.title"
        :title="$t(characteristic.title)"
        :description="$t(characteristic.description)"
        :icon="characteristic.icon"
        class="characteristic"
      />
    </div>
  </div>
</template>

<script>
import {
  SfHeading,
  SfButton,
  SfProperty,
  SfCharacteristic,
  SfInput
} from '@storefront-ui/vue';
import { computed, ref, useContext } from '@nuxtjs/composition-api';
import { useCart, cartGetters } from '@vsf-enterprise/commercetools';
import getShippingMethodPrice from '~/helpers/Checkout/getShippingMethodPrice';
import calculateCartPrice from '~/helpers/Checkout/calculateCartPrice';
import { useUiNotification } from '~/composables';
import { onSSR } from '@vue-storefront/core';

export default {
  name: 'CartPreview',
  components: {
    SfHeading,
    SfButton,
    SfProperty,
    SfCharacteristic,
    SfInput
  },
  setup() {
    const {
      app: { i18n }
    } = useContext();
    const {
      cart,
      load: loadCart,
      updateItemQty,
      applyCoupon,
      removeCoupon,
      error: cartError
    } = useCart();
    const { send } = useUiNotification();
    const listIsHidden = ref(false);
    const promoCode = ref('');
    const showPromoCode = ref(false);
    const products = computed(() => cartGetters.getItems(cart.value));
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const discounts = computed(() => cartGetters.getDiscounts(cart.value));
    const coupons = computed(() => cartGetters.getCoupons(cart.value));
    const invalidCoupons = computed(() =>
      coupons.value.filter((c) => !c.valid)
    );
    const onPromoCodeInput = (input) => {
      promoCode.value = input;
    };
    const applyCartCoupon = async () => {
      await applyCoupon({ couponCode: promoCode.value });
      const invalidCoupon = invalidCoupons.value.find(
        (coupon) => coupon.code === promoCode.value
      );
      if (invalidCoupon) {
        send({
          type: 'danger',
          message: i18n.t(
            'Coupon "{0}" doesn\'t meet criteria and cannot be applied!',
            [invalidCoupon.name]
          )
        });
      }
      if (!cartError.value.applyCoupon) {
        promoCode.value = '';
      }
    };
    const removeCartCoupon = ({ couponCode }) =>
      send({
        type: 'info',
        message: i18n.t('Do you want to remove coupon code?'),
        action: {
          text: i18n.t('Yes'),
          onClick: () => removeCoupon({ couponCode })
        },
        persist: true
      });

    onSSR(async () => {
      await loadCart();
    });

    return {
      discounts,
      coupons,
      totalItems,
      listIsHidden,
      products,
      totals,
      promoCode,
      showPromoCode,
      updateItemQty,
      cartGetters,
      onPromoCodeInput,
      applyCartCoupon,
      removeCartCoupon,
      characteristics: [
        {
          title: 'Safety',
          description: 'It carefully packaged with a personal touch',
          icon: 'safety'
        },
        {
          title: 'Easy shipping',
          description:
            'You’ll receive dispatch confirmation and an arrival date',
          icon: 'shipping'
        },
        {
          title: 'Changed your mind?',
          description: 'Rest assured, we offer free returns within 30 days',
          icon: 'return'
        }
      ],
      selectedShippingMethod: computed(
        () => cart.value?.shippingInfo?.shippingMethod
      ),
      hasSpecialPrice: computed(
        () =>
          totals.value.special > 0 &&
          totals.value.special < totals.value.subtotal
      ),
      getShippingMethodPrice,
      cartError,
      getCartPrice: (price, calculate) =>
        calculateCartPrice(cart, totals, price, calculate),
      invalidCoupons
    };
  }
};
</script>

<style lang="scss" scoped>
.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--c-light);
  padding: var(--spacer-xl) var(--spacer-xl) 0;
  &:last-child {
    padding-bottom: var(--spacer-xl);
  }
}
.total-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacer-xl);
}
.property {
  margin-bottom: var(--spacer-base);
}
.property-total {
  margin-top: var(--spacer-xl);
  padding-top: var(--spacer-lg);
  font-size: var(--font-size-xl);
  border-top: var(--c-white) 1px solid;
  --property-name-font-weight: var(--font-weight--semibold);
  --property-name-color: var(--c-text);
}
.discounts {
  margin-bottom: var(--spacer-base);
}
.discount {
  margin-bottom: var(--spacer-2xs);
}
.coupon {
  .sf-property__name::after {
    content: none;
  }
}
.coupons {
  .coupon--invalid {
    --property-name-color: var(--c-danger);
    .sf-button--text {
      --button-color: var(--c-danger);
    }
  }
}
.characteristic {
  &:not(:last-child) {
    margin-bottom: var(--spacer-base);
  }
}
.promo-code {
  display: flex;
  align-items: flex-start;
  &__button {
    --button-width: 6.3125rem;
    --button-height: var(--spacer-lg);
  }
  &__input {
    --input-background: var(--c-white);
    flex: 1;
  }
}
.discounted {
  &::v-deep .sf-property__value {
    color: var(--c-danger);
    text-decoration: line-through;
  }
}
.special-price {
  justify-content: flex-end;
  &::v-deep .sf-property__name {
    display: none;
  }
}
</style>
