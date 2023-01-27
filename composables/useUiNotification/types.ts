export enum MESSAGE_TYPES {
  ERROR = 'danger',
  SUCCESS = 'success',
  INFO = 'info'
}
export interface UseUiNotification {
  message: string;
  type: MESSAGE_TYPES;
  action?: { text: string; onClick: () => void };
  icon?: string;
  persist?: boolean;
  id?: symbol;
  dismiss?: () => void;
}
export type SendUiNotificationParams = Omit<UseUiNotification, 'id'|'dismiss'>;
