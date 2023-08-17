import { TMatchedFamily } from "@types";
import { FamilyMeta } from "@components/document/FamilyMeta";

type TProps = {
  family?: TMatchedFamily;
};

export const FamilyMatchesDrawer = ({ family }: TProps) => {
  if (!family) return null;
  const { family_geography, family_name, family_category, family_date } = family;

  return (
    <>
      <div className="p-4 pt-10 bg-gray-100">
        <h4 className="text-base">{family_name}</h4>
        <div className="flex flex-wrap text-sm gap-1 text-gray-700 mt-2 items-center font-medium">
          <FamilyMeta category={family_category} geography={family_geography} date={family_date} />
        </div>
      </div>
      <div className="h-full mr-2 overflow-y-auto scrollbar-thumb-indigo-300 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full">
        {/* Output documents and passages */}
      </div>
    </>
  );
};
