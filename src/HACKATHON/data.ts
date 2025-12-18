export type HackButton = {
  text: string;
  goToId: string;
  searchParams: string;
  goToPage: string;
  showImage: string;
};

export type HackQuestion = {
  id: string;
  text: string[];
  buttons: HackButton[];
};

export const QUESTIONS: HackQuestion[] = [
  {
    id: "1",
    text: ["What are you working on?", "Here are a few ideas to get you started..."],
    buttons: [
      { text: "Learning about a specific country", goToId: "2", searchParams: "", goToPage: "", showImage: "" },
      { text: "Writing a law/policy options paper", goToId: "11", searchParams: "", goToPage: "", showImage: "" },
      {
        text: "Assessing coherence of different policies (e.g. across climate; nature)",
        goToId: "19",
        searchParams: "",
        goToPage: "",
        showImage: "",
      },
    ],
  },
  {
    id: "2",
    text: [
      "You can find information on issues like the risks a country faces, financial flows, targets, and key policy measures.",
      "Which country would you like to focus on?",
    ],
    buttons: [
      { text: "Uganda", goToId: "3", searchParams: "l=uganda", goToPage: "", showImage: "" },
      { text: "Vietnam", goToId: "3", searchParams: "l=vietnam", goToPage: "", showImage: "" },
      { text: "Colombia", goToId: "3", searchParams: "l=colombia", goToPage: "", showImage: "" },
      { text: "France", goToId: "3", searchParams: "l=france", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "3",
    text: ["Which topic do you want to explore?"],
    buttons: [
      { text: "Financial flows", goToId: "4", searchParams: "cfn=climate+finance", goToPage: "", showImage: "" },
      { text: "Targets and commitments", goToId: "5", searchParams: "cfn=target", goToPage: "", showImage: "" },
      { text: "Subsidies", goToId: "6", searchParams: "cfn=subsidy", goToPage: "", showImage: "" },
      { text: "Bans", goToId: "7", searchParams: "cfn=ban", goToPage: "", showImage: "" },
      { text: "Climate risks", goToId: "8", searchParams: "", goToPage: "", showImage: "" },
      { text: "Just transition", goToId: "9", searchParams: "cfn=just+transition", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "4",
    text: ["Which financial flows are you interested in?"],
    buttons: [
      { text: "Biodiversity", goToId: "9", searchParams: "q=biodiversity", goToPage: "", showImage: "" },
      { text: "Adaptation", goToId: "9", searchParams: "cfn=adaptation", goToPage: "", showImage: "" },
      { text: "Renewables", goToId: "9", searchParams: "cfn=renewable+energy", goToPage: "", showImage: "" },
      { text: "Fossil fuels", goToId: "9", searchParams: "cfn=fossil+fuel", goToPage: "", showImage: "" },
      { text: "Agriculture", goToId: "9", searchParams: "cfn=agriculture+sector", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "5",
    text: ["Which targets are you interested in?"],
    buttons: [
      { text: "Biodiversity", goToId: "9", searchParams: "q=biodiversity", goToPage: "", showImage: "" },
      { text: "Adaptation", goToId: "9", searchParams: "cfn=adaptation", goToPage: "", showImage: "" },
      { text: "Renewables", goToId: "9", searchParams: "cfn=renewable+energy", goToPage: "", showImage: "" },
      { text: "Emissions reduction", goToId: "9", searchParams: "cfn=emissions+reduction+target", goToPage: "", showImage: "" },
      { text: "Agriculture", goToId: "9", searchParams: "cfn=agriculture+sector", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "6",
    text: ["Which subsidies are you interested in?"],
    buttons: [
      { text: "Biodiversity", goToId: "9", searchParams: "q=biodiversity", goToPage: "", showImage: "" },
      { text: "Renewables", goToId: "9", searchParams: "cfn=renewable+energy", goToPage: "", showImage: "" },
      { text: "Fossil fuels", goToId: "9", searchParams: "cfn=fossil+fuel", goToPage: "", showImage: "" },
      { text: "Agriculture", goToId: "9", searchParams: "cfn=agriculture+sector", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "7",
    text: ["Which bans are you interested in?"],
    buttons: [
      { text: "All bans", goToId: "9", searchParams: "", goToPage: "", showImage: "" },
      { text: "All fossil fuel bans", goToId: "9", searchParams: "cfn=fossil+fuel", goToPage: "", showImage: "" },
      { text: "Oil bans", goToId: "9", searchParams: "cfn=oil", goToPage: "", showImage: "" },
      { text: "Gas bans", goToId: "9", searchParams: "cfn=gas", goToPage: "", showImage: "" },
      { text: "Coal bans", goToId: "9", searchParams: "cfn=coal", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "8",
    text: ["Which risks are you interested in?"],
    buttons: [
      { text: "Extreme weather", goToId: "9", searchParams: "cfn=extreme+weather", goToPage: "", showImage: "" },
      { text: "Marine", goToId: "9", searchParams: "cfn=marine+risk", goToPage: "", showImage: "" },
      { text: "Terrestrial", goToId: "9", searchParams: "cfn=terrestrial+risk", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "9",
    text: [
      "Are you interested in seeing recent documents, or trends over time?",
      "Recent documents are those from the last 5 years mentioning this topic. Trends over time will show a graph showing how references to this topic have changed over time.",
    ],
    buttons: [
      { text: "Over time", goToId: "", searchParams: "", goToPage: "", showImage: "9B1.gif" },
      { text: "Now (Last 5 years)", goToId: "", searchParams: "y=2020&y=2025", goToPage: "/search", showImage: "" },
    ],
  },
  { id: "10", text: ["Search"], buttons: [{ text: "Search", goToId: "", searchParams: "q=", goToPage: "", showImage: "" }] },
  {
    id: "11",
    text: [
      "Looking at existing laws or policies in other countries is a great place to start.",
      "CPR's database can help you identify relevant laws or policies that can be used as a benchmark.",
      "Are you interested in laws or policies?",
    ],
    buttons: [
      { text: "Laws", goToId: "12", searchParams: "c=laws", goToPage: "", showImage: "" },
      { text: "Policies", goToId: "12", searchParams: "c=policies", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "13",
    text: ["Which topic do you want to explore?"],
    buttons: [
      { text: "Biodiversity", goToId: "14", searchParams: "q=biodiversity", goToPage: "", showImage: "" },
      { text: "Adaptation", goToId: "17", searchParams: "tp=adaptation", goToPage: "", showImage: "" },
      { text: "Renewables", goToId: "15", searchParams: "cfn=renewable+energy", goToPage: "", showImage: "" },
      { text: "Fossil fuels", goToId: "16", searchParams: "cfn=fossil+fuel", goToPage: "", showImage: "" },
      { text: "All areas", goToId: "14", searchParams: "", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "12",
    text: ["Are you interested in a particular region?"],
    buttons: [
      { text: "All regions", goToId: "13", searchParams: "", goToPage: "", showImage: "" },
      { text: "Sub-Saharan Africa", goToId: "13", searchParams: "r=sub-saharan-africa", goToPage: "", showImage: "" },
      { text: "South Asia", goToId: "13", searchParams: "r=south-asia", goToPage: "", showImage: "" },
      { text: "Europe and Central Asia", goToId: "13", searchParams: "r=europe-central-asia", goToPage: "", showImage: "" },
      { text: "Latin America", goToId: "13", searchParams: "r=latin-america-caribbean", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "14",
    text: ["Are you interested in specific sectors?"],
    buttons: [
      { text: "No", goToId: "18", searchParams: "", goToPage: "", showImage: "" },
      { text: "Agriculture", goToId: "", searchParams: "cfn=agriculture", goToPage: "/search", showImage: "" },
      { text: "Forestry", goToId: "", searchParams: "cfn=forestry", goToPage: "/search", showImage: "" },
      { text: "Fishing", goToId: "", searchParams: "cfn=fishing", goToPage: "/search", showImage: "" },
      { text: "Construction", goToId: "", searchParams: "cfn=construction", goToPage: "/search", showImage: "" },
    ],
  },
  {
    id: "15",
    text: ["Are you interested in specific policy instruments?"],
    buttons: [
      { text: "No", goToId: "", searchParams: "", goToPage: "/search", showImage: "" },
      { text: "Subsidy", goToId: "", searchParams: "cfn=subsidy", goToPage: "/search", showImage: "" },
      { text: "Feed-in-tariff", goToId: "", searchParams: "cfn=feed-in-tariff", goToPage: "/search", showImage: "" },
      { text: "Direct investment", goToId: "", searchParams: "cfn=direct+investment", goToPage: "/search", showImage: "" },
      { text: "Spatial planning", goToId: "", searchParams: "cfn=zoning+and+spatial+planning", goToPage: "/search", showImage: "" },
    ],
  },
  {
    id: "16",
    text: ["Are you interested in specific policy instruments?"],
    buttons: [
      { text: "No", goToId: "", searchParams: "", goToPage: "/search", showImage: "" },
      { text: "Subsidy", goToId: "", searchParams: "cfn=subsidy", goToPage: "/search", showImage: "" },
      { text: "Ban", goToId: "", searchParams: "cfn=ban", goToPage: "/search", showImage: "" },
      { text: "Spatial planning", goToId: "", searchParams: "cfn=zoning+and+spatial+planning", goToPage: "/search", showImage: "" },
    ],
  },
  {
    id: "17",
    text: ["Are you interested in specific risks?"],
    buttons: [
      { text: "No", goToId: "", searchParams: "", goToPage: "/search", showImage: "" },
      { text: "Extreme weather", goToId: "", searchParams: "cfn=extreme+weather", goToPage: "/search", showImage: "" },
      { text: "Societal impact", goToId: "", searchParams: "cfn=societal+impact", goToPage: "/search", showImage: "" },
      { text: "Terrestrial", goToId: "", searchParams: "cfn=terrestrial+risk", goToPage: "/search", showImage: "" },
    ],
  },
  {
    id: "18",
    text: ["Are you interested in specific policy instruments?"],
    buttons: [
      { text: "No", goToId: "", searchParams: "", goToPage: "/search", showImage: "" },
      { text: "Subsidy", goToId: "", searchParams: "cfn=subsidy", goToPage: "/search", showImage: "" },
      { text: "Due diligence", goToId: "", searchParams: "cfn=due+diligence", goToPage: "/search", showImage: "" },
      { text: "Codes and standards", goToId: "", searchParams: "cfn=tax", goToPage: "", showImage: "" },
      { text: "Spatial planning", goToId: "17", searchParams: "cfn=zoning+and+spatial+planning", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "19",
    text: [
      "Policy coherence can have a number of meanings. It can be across policy areas (such as climate and nature) or between a country's ambition and policy framework or approach to implementation.",
      "Are you interested in:",
    ],
    buttons: [
      { text: "Integration of climate and nature policies", goToId: "20", searchParams: "", goToPage: "", showImage: "" },
      { text: "Alignment between ambition and implementation ", goToId: "25", searchParams: "", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "20",
    text: [
      "Exploring how issues related to nature are referenced across climate documents and vice versa can be a indicator of coherent, integrated policy-making.",
      "Where do you want to start?",
    ],
    buttons: [
      { text: "How nature and climate documents reference each other", goToId: "21", searchParams: "", goToPage: "", showImage: "" },
      { text: "Integration of climate/nature synergies across targets", goToId: "23", searchParams: "", goToPage: "", showImage: "" },
      { text: "Nature-based solutions in climate policies", goToId: "24", searchParams: "", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "21",
    text: ["Are you interested in:"],
    buttons: [
      { text: "How nature documents are referenced in UN climate submissions", goToId: "22", searchParams: "", goToPage: "", showImage: "" },
      {
        text: "How climate documents are referenced in UN nature submissions",
        goToId: "",
        searchParams: "q=nbsap&c=UN-submissions&at=Party&t=National+Biodiversity+Strategy+and+Action+Plan+%28NBSAP%29",
        goToPage: "/search",
        showImage: "",
      },
    ],
  },
  {
    id: "22",
    text: ["Which UN climate submissions are you interested in?"],
    buttons: [
      {
        text: "Nationally Determined Contributions that mention UN nature submissions",
        goToId: "",
        searchParams: "q=nbsap&c=UN-submissions&at=Party&cv=unfccc&t=Nationally+Determined+Contribution",
        goToPage: "/search",
        showImage: "",
      },
      {
        text: "National Adaptation Plans that mention UN nature submissions",
        goToId: "",
        searchParams: "q=nbsap&c=UN-submissions&at=Party&cv=unfccc&t=National+Adaptation+Plan",
        goToPage: "/search",
        showImage: "",
      },
    ],
  },
  {
    id: "23",
    text: ["Which targets are you interested in?"],
    buttons: [
      {
        text: "Targets for restoration in UN climate submissions",
        goToId: "",
        searchParams: "c=UN-submissions&at=Party&cv=unfccc&q=restoration&cfn=target",
        goToPage: "",
        showImage: "23B1.png",
      },
      {
        text: "Targets for nature in mitigation policies",
        goToId: "",
        searchParams: "q=nature&cfn=target&c=policies&tp=Mitigation",
        goToPage: "23B2.png",
        showImage: "",
      },
      {
        text: "Emissions reduction targets in UN nature submissions",
        goToId: "",
        searchParams: "cfn=emissions+reduction+target&c=UN-submissions&at=Party&cv=cbd",
        goToPage: "",
        showImage: "CHART - Anne may provide",
      },
      {
        text: "Protected areas targets in climate adaptation policies ",
        goToId: "",
        searchParams: "cfn=target&c=policies&tp=Adaptation&q=protected+areas",
        goToPage: "",
        showImage: "23B4.png",
      },
    ],
  },
  {
    id: "24",
    text: ["Which areas of climate change are you interested in?"],
    buttons: [
      {
        text: "Climate mitigation",
        goToId: "",
        searchParams: "q=nature-based+solutions&c=policies&tp=Mitigation",
        goToPage: "/search",
        showImage: "",
      },
      {
        text: "Climate adaptation",
        goToId: "",
        searchParams: "q=nature-based+solutions&c=policies&tp=Adaptation",
        goToPage: "/search",
        showImage: "",
      },
      {
        text: "Disaster risk management",
        goToId: "",
        searchParams: "q=nature-based+solutions&c=policies&tp=Disaster+Risk+Management",
        goToPage: "/search",
        showImage: "",
      },
    ],
  },
];
