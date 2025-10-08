declare module 'react-native-config' {
  export interface NativeConfig {
    APP_NAME: string;
    APP_ID: string;
    N8N_WEBHOOK_URL: string;
    N8N_WEBHOOK_USERNAME: string;
    N8N_WEBHOOK_PASSWORD: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
