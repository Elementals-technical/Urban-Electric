import { useState } from "react";
import { AttributeHelper } from "../../../services/AttributeHelper";
import { ThreekitService } from "../../../services/ThreekitService";
import { useThreekitAttribute } from "../../../hook/useThreekitAttribute";

export const SimpleSelect = ({ attribute }) => {
  const {
    attribute: attributeThreekit,
    loading,
    error,
  } = useThreekitAttribute(attribute.optionName);

  const [selected, setSelected] = useState(undefined);

  const handleSelect = (assetId) => {
    setSelected(assetId);

    ThreekitService.setThreekitConfiguration({
      [attributeThreekit.name]: { assetId, type: "item" },
    });
  };

  if (loading) return <>Download...</>;
  if (error || !attributeThreekit)
    return <>SimpleSelect: Attribute loading error</>;

  return (
    <div>
      <p className="font-medium mb-2">
        {attributeThreekit &&
          AttributeHelper.getAttributeLabel(attributeThreekit)}
        :
      </p>
      <div className="flex flex-wrap gap-2">
        {attributeThreekit &&
          attributeThreekit.values.map((val) => {
            return (
              <button
                key={val.assetId}
                onClick={() => handleSelect(val.assetId)}
                className={`px-4 py-2 rounded-full border transition ${
                  selected === val.assetId
                    ? "bg-black text-white"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                {AttributeHelper.getValueLabel(val)}
              </button>
            );
          })}
      </div>
    </div>
  );
};
