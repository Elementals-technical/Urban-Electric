import { AttributeRenderer } from "../AttributeRenderer/AttributeRenderer";

export const GroupWrapper = ({ groupData }) => {
  return (
    <div className="mb-4">
      <h4 className="text-lg font-semibold mb-2">{groupData.groupName}</h4>
      <div className="grid gap-2">
        {groupData.options.map((attr) => (
          <AttributeRenderer
            key={`${attr.optionName}-${attr.order}`}
            attributeGroup={attr}
          />
        ))}
      </div>
    </div>
  );
};
