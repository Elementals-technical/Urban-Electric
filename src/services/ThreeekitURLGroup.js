// ThreekitURLGenerator.js
// (Цей клас ми використовуємо на UI стороні для генерації URL на основі параметрів)

export default class ThreekitURLGenerator {
  /**
   * Конструктор приймає параметри для формування URL.
   * @param {object} options
   * @param {string} options.assetId
   * @param {string} options.orgId
   * @param {string} options.display
   * @param {number|string} options.height
   * @param {number|string} options.width
   * @param {string} options.format
   * @param {string} options.bearer_token
   * @param {string} [options.stageId]
   * @param {object} options.configuration
   * @param {object} options.stageConfiguration
   */
  constructor({
    assetId,
    orgId,
    display,
    height,
    width,
    format,
    bearer_token,
    stageId,
    configuration,
    stageConfiguration,
  }) {
    this.assetId = assetId;
    this.orgId = orgId;
    this.display = display;
    this.height = height;
    this.width = width;
    this.format = format;
    this.bearer_token = bearer_token;
    this.stageId = stageId;
    this.configuration = configuration;
    this.stageConfiguration = stageConfiguration;
    this.baseUrl = "https://preview.threekit.com/api/fast-compositor/";
  }

  /**
   * Генерує URL для Fast Compositor API.
   * @returns {string} Сформований URL.
   */
  generateURL() {
    const params = new URLSearchParams();

    params.append("assetId", this.assetId);
    params.append("orgId", this.orgId);
    params.append("display", this.display);
    // params.append("height", this.height);
    // params.append("width", this.width);
    // params.append("format", this.format);
    params.append("bearer_token", this.bearer_token);
    params.append("stageId", this.stageId);

    // if (this.stageId) {
    // }
    // debugger;
    if (this.configuration) {
      params.append("configuration", JSON.stringify(this.configuration));
    }
    if (this.stageConfiguration) {
      params.append(
        "stageConfiguration",
        JSON.stringify(this.stageConfiguration)
      );
    }
    // &stageConfiguration=%7B"Camera"%3A5%7D

    return `${this.baseUrl}?${params.toString()}`;
  }
}
