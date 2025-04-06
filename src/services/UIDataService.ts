import { AttributeHelper } from "./AttributeHelper";

export class UIDataService {
  private static urlPlaceholder = `https://fakeimg.pl/68x68`;

  static getThumbnailImage(val): string {
    let imageUrlThreekit = AttributeHelper.getThumbnail(val);
    if (!imageUrlThreekit) imageUrlThreekit = this.urlPlaceholder;

    return imageUrlThreekit;
  }
}
