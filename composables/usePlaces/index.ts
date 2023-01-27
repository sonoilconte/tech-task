import { computed } from '@nuxtjs/composition-api';
import { channelGetters, useChannel } from '@vsf-enterprise/commercetools';
import { Channel } from '@vsf-enterprise/commercetools-types';
import { UsePlaces } from './types';

export default function usePlaces(): UsePlaces {
  const { channel: selectedChannel, channels } = useChannel();
  const places = computed(() => channelGetters.getPlacesFromChannels(channels.value as Channel[]));
  const selectedPlace = computed(() => {
    if (selectedChannel.value && places.value) {
      return channelGetters.getSelectedChannel(places.value, selectedChannel.value);
    }
    return null;
  });

  return {
    selectedPlace,
    places
  };
}
