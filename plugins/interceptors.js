import { useUiNotification } from '~/composables';
import { MESSAGE_TYPES } from '~/composables/useUiNotification/types';

export default function(context) {
  const { app: { $vsf, i18n } } = context;

  const { send } = useUiNotification();

  $vsf.$ct.client.interceptors.response.use(
    (response) => {
      if (response.data?.message) {
        send({
          type: MESSAGE_TYPES.ERROR,
          message: i18n.t(response.data.message)
        });
      }
      return response;
    },
    (error) => {
      send({
        type: MESSAGE_TYPES.ERROR,
        message: i18n.t(error.response?.data?.message || error.message)
      });
      return Promise.reject(error);
    }
  );

  return true;
}
