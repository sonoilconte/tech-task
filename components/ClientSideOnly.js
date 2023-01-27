import { ref, onMounted } from '@nuxtjs/composition-api';

export default {
  name: 'ClientSideOnly',
  setup (_, { slots }) {
    const mounted = ref(false);
    onMounted(() => {
      mounted.value = true;
    });
    return () => {
      if (mounted.value) {
        return slots.default && slots.default();
      }
      return null;
    };
  }
};
