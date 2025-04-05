import { GroupWrapper } from "../GroupWrapper/GroupWrapper";

export const SectionWrapper = ({ sectionsData }) => {
  console.log("sectionsData", sectionsData);

  return (
    <section className="mb-6">
      <h3 className="text-xl font-bold mb-3 border-b pb-1">
        {sectionsData.section}
      </h3>
      {sectionsData.groups.map((group) => (
        <GroupWrapper
          key={`${group.groupName}${group.sort}`}
          groupData={group}
        />
      ))}
    </section>
  );
};
