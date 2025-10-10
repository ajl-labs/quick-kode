interface IWebhookData {
  url: string;
  username?: string;
  password?: string;
  paths?: string[];
  failed?: boolean;
}
