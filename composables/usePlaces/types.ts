import { ComputedRef } from '@nuxtjs/composition-api';
import { AgnosticPlace } from '@vsf-enterprise/commercetools';
import { Channel } from '@vsf-enterprise/commercetools-types';

export interface UsePlaces {
  selectedPlace: ComputedRef<AgnosticPlace | null>;
  places: ComputedRef<Channel[]>
}
