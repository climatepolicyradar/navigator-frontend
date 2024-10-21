import React from "react";
// import { Globe, Calendar, Folder, Layout, Target, Building2, DollarSign, Link } from "lucide-react";

// const projectData = {
//   countries: ["Benin", "Burkina Faso", "Côte d'Ivoire", "Ghana", "Mali", "Nigeria", "Togo"],
//   fiscalYear: "2000",
//   fund: "Green Climate Fund",
//   theme: "Adaptation",
//   resultsArea: "Something specific",
//   sector: "Public",
//   fundSpend: 1000000,
//   coFinancing: 1000000,
//   projectUrl: "#",
// };

// const MetadataRow = ({ icon: Icon, label, children, key }) => (
//   <div key={key} className="flex items-center gap-3 text-gray-700">
//     <Icon className="w-5 h-5 text-gray-500 shrink-0" />
//     <span className="font-medium">{label}</span>
//     <div className="flex flex-wrap gap-2">{children}</div>
//   </div>
// );

const FamilyMetadata = ({ familyMetadata }) => {
  // interface DataItem {
  //   icon: React.ComponentType;
  //   value: string | number | string[];
  //   label: string;
  // }

  // const data: Record<string, DataItem> = {
  //   countries: { icon: Globe, value: ["Benin"], label: "Geographies" },
  //   fiscalYear: { icon: Calendar, value: 1996, label: "Financial" },
  // };

  // const data = {
  //   countries: {
  //     icon: Globe,
  //     value: ["Benin"],
  //     label: "Geographies",
  //   },
  //   fiscalYear: {
  //     icon: Calendar,
  //     value: 1996,
  //     label: "Financial",
  //   },
  // };

  //       <>

  //       {Object.values(data).map(() => {
  //                 <div>
  //       <MetadataRow icon={Calendar} label="Approval FY">
  //         {fiscalYear}
  //       </MetadataRow>
  //     </div>
  //       }

  //         </>
  //   );

  const fiscalYear = 9000;
  return (
    <div>
      {/* {Object.values(data).map((item) => (
        <MetadataRow icon={item.icon} label="Approval FY">
          {fiscalYear}
        </MetadataRow>
      ))} */}
      hello
    </div>
  );
};

export default FamilyMetadata;
