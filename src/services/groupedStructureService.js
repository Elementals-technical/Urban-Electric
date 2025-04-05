// services/GroupedStructureService.js
// Групування атрибутів з UIGrouping

export class GroupedStructureService {
  static buildGroupedStructure(attributes) {
    const uiGroupingAttr = attributes.find(
      (attr) => attr.name === "UIGrouping"
    );
    if (!uiGroupingAttr || !uiGroupingAttr.value) return [];

    try {
      const uiGrouping = JSON.parse(uiGroupingAttr.value);
      return uiGrouping;
    } catch (error) {
      console.error("Помилка при розборі UIGrouping:", error);
      return [];
    }
  }
}
