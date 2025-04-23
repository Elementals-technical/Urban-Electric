// src/services/UrlService.ts

export class UrlService {
  /**
   * Returns the value of the query parameter from window.location.search
   * @param key — parameter name
   */
  static getQueryParam(key: string): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  /**
   * Special method for an asset (like yours)
   */
  static getAsset(): string | null {
    return UrlService.getQueryParam("asset");
  }
}
