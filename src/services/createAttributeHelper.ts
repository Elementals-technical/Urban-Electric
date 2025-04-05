export class AttributeHelper {
  // Отримати назву атрибута: label або name
  static getAttributeLabel(attribute) {
    return (
      attribute?.metadata?.label ||
      attribute?.metadata?.Label ||
      attribute?.name ||
      "Unnamed"
    );
  }
  static getValueLabel(attribute) {
    return (
      attribute?.metadata?.label ||
      attribute?.metadata?.Label ||
      attribute?.name ||
      "Unnamed"
    );
  }
  static getThumbnail(value) {
    const thumbnail = value?.metadata?.thumbnail || value?.metadata?.Thumbnail;
    if (!thumbnail) return undefined;
    const url = `https://preview.threekit.com${thumbnail}`;

    return url;
  }
  static getImage(value) {
    const Image = value?.metadata?.Image || value?.metadata?.image;
    if (!Image) return undefined;

    const url = `https://preview.threekit.com${Image}`;

    return url;
  }

  // Отримати HEX-код кольору
  static getHexColor(value) {
    return value?.metadata?.hex || value?.metadata?.Hex || null;
  }
}
