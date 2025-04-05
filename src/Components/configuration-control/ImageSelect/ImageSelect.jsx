import { useEffect, useState } from "react";
import { AttributeHelper } from "../../../services/createAttributeHelper";
import { ImageGridZoom } from "../ImageGridZoom/ImageGridZoom";

export const ImageSelect = ({ attribute }) => {
  const [attributeSelecteThreekit, setAttributeSelecteThreekit] =
    useState(undefined);

  const [selected, setSelected] = useState(attribute.value?.assetId);

  const handleSelect = (assetId) => {
    setSelected(assetId);

    window.configurator.setConfiguration({
      [attributeSelecteThreekit.name]: { assetId, type: "item" },
    });
  };

  const { optionName } = attribute;

  useEffect(() => {
    let initAttribute = async () => {
      const conf = await window.player.getConfigurator();

      let attributeThreekit = conf
        .getDisplayAttributes()
        .find((attr) => attr.name === optionName);

      setAttributeSelecteThreekit(attributeThreekit);

      setSelected(attributeThreekit.value?.assetId);
    };

    initAttribute();
  }, []);

  if (!attributeSelecteThreekit) return <>ImageSelect ...</>;

  return (
    <div>
      <p className="font-medium mb-2">
        {AttributeHelper.getAttributeLabel(attributeSelecteThreekit)}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {attributeSelecteThreekit.values.map((val) => {
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
                src={
                  AttributeHelper.getThumbnail(val) ||
                  "https://via.placeholder.com/60"
                }
                alt={val.metadata?.label || val.label || val.name}
                className="h-12 w-12 object-contain mb-1"
              />
              <span className="text-sm text-center">
                {AttributeHelper.getValueLabel(val)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
