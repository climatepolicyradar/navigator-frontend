import useConfig from "@hooks/useConfig";

import { calculateTotalDocuments } from "@helpers/getDocumentCounts";

import { INSTRUCTIONS } from "@cclw/constants/instructions";

const Instructions = () => {
  const configQuery = useConfig();
  const { data: { organisations } = {} } = configQuery;

  const totalDocuments = calculateTotalDocuments(organisations);

  return (
    <div className="max-w-[820px] mx-auto relative">
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
        {INSTRUCTIONS(totalDocuments).map((instruction, index) => (
          <div key={index} className="p-4 flex gap-4 items-center bg-cclw-light" data-cy={instruction.cy}>
            <div className="flex items-center justify-center">{instruction.icon}</div>
            <div>{instruction.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Instructions;
