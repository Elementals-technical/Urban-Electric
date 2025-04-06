type valueConfig = any;
type Configuration = Record<string, valueConfig>;

export class ThreekitService {
  /**
   * Очікує поки буде доступна функція window.player.getConfigurator та повертає результат.
   */
  static loadConfigurator(): Promise<any> {
    return new Promise((resolve, reject) => {
      const checkConfigurator = () => {
        if (
          window.player &&
          typeof window.player.getConfigurator === "function"
        ) {
          window.player.getConfigurator().then(resolve).catch(reject);
        } else {
          setTimeout(checkConfigurator, 100);
        }
      };
      checkConfigurator();
    });
  }

  static async getAttribute(optionName: string) {
    const configurator = await this.loadConfigurator();
    return configurator
      .getDisplayAttributes()
      .find((attr) => attr.name === optionName);
  }

  static setThreekitConfiguration(configuration: Configuration) {
    //@ts-ignore
    return window.configurator.setConfiguration(configuration);
  }
}
