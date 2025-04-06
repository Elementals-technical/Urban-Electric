import { useMemo } from "react";
import { SimpleSelect } from "../configuration-control/SimpleSelect/SimpleSelect";
import { MaterialSelect } from "../configuration-control/MaterialSelect/MaterialSelect";
import { ImageSelect } from "../configuration-control/ImageSelect/ImageSelect";

const getComponentByType = (type, attribute) => {
  const components = {
    image: <ImageSelect attribute={attribute} />,
    material: <MaterialSelect attribute={attribute} />,
    simple: <SimpleSelect attribute={attribute} />,
  };

  return components[type] || components.simple;
};

export const AttributeRenderer = ({ attributeGroup }) => {
  const type = attributeGroup?.typeComponent || "simple";

  const renderedComponent = useMemo(
    () => getComponentByType(type, attributeGroup),
    [type, attributeGroup]
  );

  return renderedComponent;
};
