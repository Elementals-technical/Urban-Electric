import { IConfigurationArray, IConfigurationAsset, IConfigurationColor } from "@threekit-tools/treble/dist/types";
import { updateConfigurationAttributes } from "./configuratorSlice";

type ArrayItem = {
  id: string;
  label: string;
  value: string | number | boolean;
  data: any[];
};

export const updateArrayValueById = (
  originalArray: ArrayItem[],
  idToFind: string,
  newValue: any
): ArrayItem[] => {
  const newArray = originalArray.map((item) => ({ ...item }));
  const itemToUpdate = newArray.find((item) => item.id === idToFind);
  if (itemToUpdate) {
    itemToUpdate.value = newValue;
  }
  return newArray;
};

export const updateConfigurationAttributesHandle = (dispatch: any) => {
  const displayAttributes =
    window.threekit.configurator.getDisplayAttributes() as any[];
  const listAttribute = displayAttributes.filter(
    (attribute: any) =>
      attribute.metadata && attribute.metadata.category === "true"
  );
  const sortedAttributes = listAttribute
    .filter((i) => i.metadata.category)
    .sort((a, b) => (a.metadata.Sort || 0) - (b.metadata.Sort || 0));

  dispatch(updateConfigurationAttributes(sortedAttributes));
};

export const isConfigurationAsset = (
  attr: IConfigurationAsset | IConfigurationArray | IConfigurationColor
): attr is IConfigurationAsset => {
  return "assetId" in attr;
};
