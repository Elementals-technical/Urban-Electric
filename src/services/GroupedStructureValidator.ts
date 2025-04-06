type Attribute = {
  name: string;
};

type Option = {
  option: string;
  optionName: string;
  order: string;
  type: string;
  typeComponent: string;
};

type Group = {
  groupName: string;
  order: string;
  options: Option[];
};

type Section = {
  section: string;
  sort: string;
  groups: Group[];
};

export class GroupedStructureValidator {
  static VALID_TYPES = ["simple", "filter"];
  static VALID_COMPONENTS = ["simple", "image", "material"];

  static validate(structure: Section[], attributes: Attribute[]) {
    const errors: string[] = [];
    const attributeNames = new Set(attributes.map(attr => attr.name));
    const usedSectionSorts = new Set<string>();

    structure.forEach((section, sectionIdx) => {
      const sectionPath = `Section[${sectionIdx}]: ${section.section}`;

      // Validate section name and sort
      if (!section.section) {
        errors.push(`❌ ${sectionPath} is missing 'section' name`);
      }
      if (!section.sort) {
        errors.push(`❌ ${sectionPath} is missing 'sort'`);
      } else if (usedSectionSorts.has(section.sort)) {
        errors.push(`❌ Duplicate section.sort '${section.sort}' in ${sectionPath}`);
      } else {
        usedSectionSorts.add(section.sort);
      }

      const usedGroupOrders = new Set<string>();

      section.groups?.forEach((group, groupIdx) => {
        const groupPath = `${sectionPath} > Group[${groupIdx}]: ${group.groupName}`;

        if (!group.groupName) {
          errors.push(`❌ ${groupPath} is missing 'groupName'`);
        }
        if (!group.order) {
          errors.push(`❌ ${groupPath} is missing 'order'`);
        } else if (usedGroupOrders.has(group.order)) {
          errors.push(`❌ Duplicate group.order '${group.order}' in ${groupPath}`);
        } else {
          usedGroupOrders.add(group.order);
        }

        const usedOptionOrders = new Set<string>();

        group.options?.forEach((option, optIdx) => {
          const optPath = `${groupPath} > Option[${optIdx}]: ${option.option}`;

          if (!option.optionName) {
            errors.push(`❌ ${optPath} is missing 'optionName'`);
          } else if (!attributeNames.has(option.optionName)) {
            errors.push(`❌ ${optPath} - optionName '${option.optionName}' not found in 3DT attributes`);
          }

          if (!option.order) {
            errors.push(`❌ ${optPath} is missing 'order'`);
          } else if (usedOptionOrders.has(option.order)) {
            errors.push(`❌ Duplicate option.order '${option.order}' in ${optPath}`);
          } else {
            usedOptionOrders.add(option.order);
          }

          if (!GroupedStructureValidator.VALID_TYPES.includes(option.type)) {
            errors.push(`❌ ${optPath} has invalid type '${option.type}'`);
          }

          if (!GroupedStructureValidator.VALID_COMPONENTS.includes(option.typeComponent)) {
            errors.push(`❌ ${optPath} has invalid typeComponent '${option.typeComponent}'`);
          }
        });
      });
    });

    if (errors.length === 0) {
      console.log("✅ UIGrouping structure is valid.");
    } else {
      console.group("⚠️ UIGrouping Validation Errors:");
      errors.forEach(err => console.warn(err));
      console.groupEnd();
    }

    return errors;
  }
}
