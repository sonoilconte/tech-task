import { ref } from '@nuxtjs/composition-api';
import { UseProductLoading } from './types';

export default function useProductLoading(): UseProductLoading {
  const loadingProduct = ref(null);

  return {
    setProductLoading: (id = null) => loadingProduct.value = id,
    isProductLoading: (id) => loadingProduct.value === id
  };
}
