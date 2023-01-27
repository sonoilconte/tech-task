import { computed, ref, Ref, useContext } from '@nuxtjs/composition-api';
import { DELIVERY_TYPES, UseDeliveryType } from './types';

const selected: Ref<string> = ref('');

export default function useDeliveryType(): UseDeliveryType {
  const { app: { context: { $vsf: { $ct: { config: { enableClickCollect } } } } } } = useContext();
  const change = (option: DELIVERY_TYPES) => {
    selected.value = option;
  };
  const getInitialSelectedDeliveryType = () => {
    if (enableClickCollect) return null;
    return DELIVERY_TYPES.DELIVERY;
  };
  if (!selected.value) {
    selected.value = getInitialSelectedDeliveryType();
  }

  return {
    selected: computed(() => selected.value),
    change
  };
}
