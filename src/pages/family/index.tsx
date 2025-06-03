import { Columns } from "@/components/atoms/columns/Columns";
import { SubColumns } from "@/components/atoms/columns/SubColumns";

const ExperimentalFamilyPage = () => {
  return (
    <Columns>
      <div className="bg-amber-100 h-[300px]">One</div>
      <div className="bg-amber-200 h-[300px]">Two</div>
      <div className="bg-amber-300 h-[300px]">Three</div>
      <SubColumns className="bg-amber-400 h-[300px]">
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </SubColumns>
      {/* <div className="bg-blue-100 h-[300px]">One</div>
      <div className="bg-blue-200 h-[300px] cols-3:col-span-2 cols-4:col-span-3 grid grid-cols-subgrid">
        <div>a</div>
        <div>b</div>
        <div>c</div>
      </div> */}
    </Columns>
  );
};

export default ExperimentalFamilyPage;
