import { ComputedRef } from '@nuxtjs/composition-api';

export enum DELIVERY_TYPES {
  DELIVERY = 'delivery',
  COLLECT = 'collect'
}

export interface UseDeliveryType {
  selected: ComputedRef<string>;
  change: (option: DELIVERY_TYPES) => void;
}
