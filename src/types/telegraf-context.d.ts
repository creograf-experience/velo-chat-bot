declare module 'telegraf' {
  interface ContextMessageUpdate {
    scene: any;
    session: {
      settingsScene: {
        messagesToDelete: any[];
      };
    };
    webhookReply: boolean;
  }
}
