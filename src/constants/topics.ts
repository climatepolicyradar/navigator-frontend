export const ROOT_TOPICS = {
  Q1651: "Target",
  Q709: "Economic sector",
  Q975: "Risk",
  Q638: "Fossil fuel",
  Q672: "Impacted group",
  Q1343: "Climate finance",
  Q1171: "Policy instrument",
  Q218: "Greenhouse gas",
  Q1367: "Public finance actor",
  Q47: "Just transition",
  Q567: "Renewable energy",
  Q557: "Adaptation",
} satisfies Record<string, string>;

type TRootTopicId = keyof typeof ROOT_TOPICS;

export const ORDERED_ROOT_TOPIC_IDS: TRootTopicId[] = [
  "Q1651",
  "Q1171",
  "Q975",
  "Q672",
  "Q47",
  "Q567",
  "Q638",
  "Q218",
  "Q709",
  "Q1343",
  "Q1367",
  "Q557",
];
