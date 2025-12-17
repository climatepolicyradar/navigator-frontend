export type HackButton = {
  text: string;
  goToId: string;
  searchParams: string;
  goToPage: string;
  showImage: string;
};

export type HackQuestion = {
  id: string;
  text: string;
  buttons: HackButton[];
};

export const QUESTIONS: HackQuestion[] = [
  {
    id: "1",
    text: "What are you working on?",
    buttons: [
      { text: "Learning about a specific country", goToId: "2", searchParams: "", goToPage: "", showImage: "" },
      { text: "Writing a law/ policy options paper", goToId: "11", searchParams: "", goToPage: "", showImage: "" },
      { text: "Policy coherence", goToId: "", searchParams: "", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "2",
    text: "Which country?",
    buttons: [
      { text: "Uganda", goToId: "3", searchParams: "l=uganda", goToPage: "", showImage: "" },
      { text: "Vietnam", goToId: "3", searchParams: "l=vietnam", goToPage: "", showImage: "" },
      { text: "Colombia", goToId: "3", searchParams: "l=colombia", goToPage: "", showImage: "" },
      { text: "France", goToId: "3", searchParams: "l=france", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "3",
    text: "What topic do you want to explore?",
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
    text: "Financing of which area?",
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
    text: "Targets for which area?",
    buttons: [
      { text: "Biodiversity", goToId: "9", searchParams: "q=biodiversity", goToPage: "", showImage: "" },
      { text: "Adaptation", goToId: "9", searchParams: "cfn=adaptation", goToPage: "", showImage: "" },
      { text: "Renewables", goToId: "9", searchParams: "cfn=renewable+energy", goToPage: "", showImage: "" },
      { text: "Fossil fuels", goToId: "9", searchParams: "cfn=fossil+fuel", goToPage: "", showImage: "" },
      { text: "Agriculture", goToId: "9", searchParams: "cfn=agriculture+sector", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "6",
    text: "Subsidies for which area?",
    buttons: [
      { text: "Biodiversity", goToId: "9", searchParams: "q=biodiversity", goToPage: "", showImage: "" },
      { text: "Renewables", goToId: "9", searchParams: "cfn=renewable+energy", goToPage: "", showImage: "" },
      { text: "Fossil fuels", goToId: "9", searchParams: "cfn=fossil+fuel", goToPage: "", showImage: "" },
      { text: "Agriculture", goToId: "9", searchParams: "cfn=agriculture+sector", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "7",
    text: "Bans for which area?",
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
    text: "Which risks are you interested in?",
    buttons: [
      { text: "Extreme weather", goToId: "9", searchParams: "cfn=extreme+weather", goToPage: "", showImage: "" },
      { text: "Marine", goToId: "9", searchParams: "cfn=marine+risk", goToPage: "", showImage: "" },
      { text: "Terrestrial", goToId: "9", searchParams: "cfn=terrestrial+risk", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "9",
    text: "Are you interested in now or over time?",
    buttons: [
      {
        text: "Over time",
        goToId: "",
        searchParams: "",
        goToPage: "",
        showImage: "https://commons.wikimedia.org/wiki/File:Graph_WP_extended_growth_2025.gif",
      },
      { text: "Now (Last 5 years)", goToId: "", searchParams: "y=2020&y=2025", goToPage: "/search", showImage: "" },
    ],
  },
  { id: "10", text: "Search", buttons: [{ text: "Search", goToId: "", searchParams: "q=", goToPage: "", showImage: "" }] },
  {
    id: "11",
    text: "Do you want to research laws or policies?",
    buttons: [
      { text: "Laws", goToId: "12", searchParams: "c=laws", goToPage: "", showImage: "" },
      { text: "Policies", goToId: "12", searchParams: "c=policies", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "13",
    text: "Which area are you interested in?",
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
    text: "Which region?",
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
    text: "Are you interested in specific policy instruments?",
    buttons: [
      { text: "No", goToId: "17", searchParams: "", goToPage: "", showImage: "" },
      { text: "Subsidy", goToId: "17", searchParams: "cfn=subsidy", goToPage: "", showImage: "" },
      { text: "Due diligence", goToId: "17", searchParams: "cfn=due+diligence", goToPage: "", showImage: "" },
      { text: "Tax", goToId: "17", searchParams: "cfn=tax", goToPage: "", showImage: "" },
      { text: "Spatial planning", goToId: "17", searchParams: "cfn=zoning+and+spatial+planning", goToPage: "", showImage: "" },
    ],
  },
  {
    id: "15",
    text: "Are you interested in specific policy instruments?",
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
    text: "Are you interested in specific policy instruments?",
    buttons: [
      { text: "No", goToId: "", searchParams: "", goToPage: "/search", showImage: "" },
      { text: "Subsidy", goToId: "", searchParams: "cfn=subsidy", goToPage: "/search", showImage: "" },
      { text: "Ban", goToId: "", searchParams: "cfn=ban", goToPage: "/search", showImage: "" },
      { text: "Spatial planning", goToId: "", searchParams: "cfn=zoning+and+spatial+planning", goToPage: "/search", showImage: "" },
    ],
  },
  {
    id: "17",
    text: "Are you interested in specific risks?",
    buttons: [
      { text: "No", goToId: "", searchParams: "", goToPage: "/search", showImage: "" },
      { text: "Extreme weather", goToId: "", searchParams: "cfn=extreme+weather", goToPage: "/search", showImage: "" },
      { text: "Societal impact", goToId: "", searchParams: "cfn=societal+impact", goToPage: "/search", showImage: "" },
      { text: "Terrestrial", goToId: "", searchParams: "cfn=terrestrial+risk", goToPage: "/search", showImage: "" },
    ],
  },
];
