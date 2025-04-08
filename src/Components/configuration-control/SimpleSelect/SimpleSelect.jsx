import { useEffect, useState } from "react";
import { AttributeHelper } from "../../../services/AttributeHelper";
import { ThreekitService } from "../../../services/ThreekitService";
// import { useThreekitAttribute } from "../../../hook/useThreekitAttribute";
import { useStoreDispatch, useStoreSelector } from "../../../main";
import { getAttributeByName } from "../../../redux/features/configurator/configurator.selector";
import { setActiveAttributes } from "../../../redux/features/configurator/configuratorSlice";

export const SimpleSelect = ({ attribute }) => {
  let attributeThreekit = useStoreSelector(
    getAttributeByName(attribute.optionName)
  );

  const dispatch = useStoreDispatch(setActiveAttributes);
  const [selected, setSelected] = useState(undefined);
  // debugger;
  const handleSelect = (assetId) => {
    setSelected(assetId);

    dispatch(
      setActiveAttributes({
        name: attributeThreekit.name,
        value: { assetId, type: "item" },
      })
    );
  };

  useEffect(() => {
    if (attributeThreekit) {
      setSelected(attributeThreekit.value.assetId);
    }
  }, [attributeThreekit]);

  if (!attributeThreekit) return <></>;

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
