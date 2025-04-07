import { AttributeHelper } from "../../../services/AttributeHelper";
import { ThreekitService } from "../../../services/ThreekitService";
import { UIDataService } from "../../../services/UIDataService";
import { useThreekitAttribute } from "../../../hook/useThreekitAttribute";
import { useEffect, useState } from "react";

export const ImageSelect = ({ attribute }) => {
  const {
    attribute: attributeThreekit,
    loading,
    error,
  } = useThreekitAttribute(attribute.optionName);
  const [selected, setSelected] = useState(attribute.value?.assetId);

  const handleSelect = (assetId) => {
    setSelected(assetId);
    ThreekitService.setThreekitConfiguration({
      [attributeThreekit.name]: { assetId, type: "item" },
    }).then(() => {
      // debugger
    });
  };

  useEffect(() => {
    if (!loading) {
      setSelected(attributeThreekit.value.assetId);
    }
  }, [loading]);

  if (loading) return <>Download...</>;
  if (error || !attributeThreekit)
    return <>ImageSelect: Attribute loading error</>;

  return (
    <div>
      <p className="font-medium mb-2">
        {AttributeHelper.getAttributeLabel(attributeThreekit)}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {attributeThreekit.values.map((val) => {
          const label = AttributeHelper.getValueLabel(val);
          return (
            <button
              key={val.assetId}
              onClick={() => handleSelect(val.assetId)}
              className={`border rounded-md p-2 flex flex-col items-center justify-center transition ${
                selected === val.assetId
                  ? "ring-2 ring-black"
                  : "border-gray-300"
              }`}
            >
              <img
                src={UIDataService.getThumbnailImage(val)}
                alt={label}
                className="h-12 w-12 object-contain mb-1"
              />
              <span className="text-sm text-center">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
