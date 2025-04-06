// services/GroupedStructureService.js

// Interfaces for the data structure

// Option interface
export interface Option {
  option: string;
  optionName: string;
  order: string; // Consider using number if converting values
  type: string;
  typeComponent: string;
}

// Group interface
export interface Group {
  groupName: string;
  order: string; // Consider using number if converting values
  options: Option[];
}

// Section interface
export interface Section {
  section: string;
  sort: string; // Consider using number if converting values
  groups: Group[];
}

export class GroupedStructureService {
  static getGroupedStructure(attributes) {
    // Find the UIGrouping attribute by name.
    const uiGroupingAttr = attributes.find(
      (attr) => attr.name === "UIGrouping"
    );

    if (!uiGroupingAttr || !uiGroupingAttr.value) {
      console.warn("UIGrouping attribute not found or has no value.");
      return [];
    }

    try {
      // Parse the attribute value into the expected Section[] structure.
      const uiGrouping: Section[] = JSON.parse(uiGroupingAttr.value);
      return uiGrouping;
    } catch (error) {
      console.error("Error parsing UIGrouping:", error);
      return [];
    }
  }
}
