import { transformVespaMetadataToFamilyMetadata } from "./vespa";

const vespaMetadata = [
  {
    name: "family.topic",
    value: "Mitigation",
  },
  {
    name: "family.sector",
    value: "Transport",
  },
  {
    name: "family.instrument",
    value: "Capacity building|Governance",
  },
  {
    name: "family.instrument",
    value: "Processes, plans and strategies|Governance",
  },
  {
    name: "family.instrument",
    value: "MRV|Governance",
  },
  {
    name: "family.instrument",
    value: "International cooperation|Governance",
  },
  {
    name: "family.instrument",
    value: "Education, training and knowledge dissemination|Information",
  },
  {
    name: "document.role",
    value: "MAIN",
  },
  {
    name: "document.type",
    value: "Strategy",
  },
];

describe("transformVespaMetadataToFamilyMetadata", () => {
  it("should transform vespa metadata to family metadata", () => {
    const result = transformVespaMetadataToFamilyMetadata(vespaMetadata);
    expect(result).toEqual({
      topic: ["Mitigation"],
      sector: ["Transport"],
      instrument: [
        "Capacity building|Governance",
        "Processes, plans and strategies|Governance",
        "MRV|Governance",
        "International cooperation|Governance",
        "Education, training and knowledge dissemination|Information",
      ],
      role: ["MAIN"],
      type: ["Strategy"],
    });
  });
});
