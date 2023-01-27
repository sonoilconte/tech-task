<template>
  <form class="form" @submit.prevent="submitForm">
    <div class="form__horizontal">
      <div class="form__element">
        <SfInput
          v-e2e="'myaccount-firstName'"
          v-model="form.firstName"
          name="firstName"
          :label="$t('First name')"
          required
        />
      </div>
      <div class="form__element">
        <SfInput
          v-e2e="'myaccount-lastName'"
          v-model="form.lastName"
          name="lastName"
          :label="$t('Last name')"
          required
        />
      </div>
    </div>
    <div class="form__element">
      <SfInput
        v-e2e="'myaccount-email'"
        v-model="form.email"
        type="email"
        name="email"
        :label="$t('Your e-mail')"
        required
      />
    </div>
    <div class="form__element">
      <SfInput
        v-e2e="'myaccount-date-of-birth'"
        v-model="form.dateOfBirth"
        type="date"
        name="dateOfBirth"
        :label="$t('Date of birth')"
        required
        :max="maxDateOfBirth"
        :min="minDateOfBirth"
      />
    </div>
    <SfButton
      class="form__button"
      type="submit"
    >
      {{ $t('Update personal data') }}
    </SfButton>
  </form>
</template>

<script>
import { useUser, userGetters } from '@vsf-enterprise/commercetools';
import { ref, useContext, watch } from '@nuxtjs/composition-api';
import { SfInput, SfButton } from '@storefront-ui/vue';
import { useUiNotification } from '~/composables';

export default {
  name: 'ProfileUpdateForm',
  components: {
    SfInput,
    SfButton
  },
  setup(_, { emit }) {
    const { app: { i18n } } = useContext();
    const { user } = useUser();
    const { send } = useUiNotification();

    const resetForm = () => ({
      firstName: userGetters.getFirstName(user.value),
      lastName: userGetters.getLastName(user.value),
      email: userGetters.getEmailAddress(user.value),
      dateOfBirth: userGetters.getDateOfBirth(user.value)
    });

    const form = ref(resetForm());

    const submitForm = () => {
      const onComplete = () => {
        send({ type: 'success', message: i18n.t('Personal data has been updated'), icon: 'account' });
      };

      const onError = () => {
        // TODO: Handle error
      };
      emit('submit', { form, onComplete, onError });
    };

    watch(user, () => {
      form.value = resetForm();
    });

    return {
      form,
      submitForm,
      maxDateOfBirth: new Intl.DateTimeFormat('fr-CA').format(Date.now()),
      minDateOfBirth: new Intl.DateTimeFormat('fr-CA').format(new Date('1900'))
    };
  }
};
</script>

<style lang="scss" scoped>
.form {
  &__element {
    display: block;
    margin: 0 0 var(--spacer-lg) 0;
  }
  &__button {
    display: block;
    width: 100%;
    @include for-desktop {
      width: fit-content;
    }
  }
  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-2xl);
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
