import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FiltersContext } from "@/context/FiltersContext";
import { TNestedSearchLabel } from "@/types";

import { SearchFilterLookup } from "./SearchFilterLookup";

const meta = {
  title: "Molecules/SearchFilterLookup",
  component: SearchFilterLookup,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  render: (props) => (
    // eslint-disable-next-line no-console
    <FiltersContext value={{ checkedLabelPaths: [], toggleFilter: (labelPath, checked) => console.info({ labelPath, checked }) }}>
      <SearchFilterLookup {...props} />
    </FiltersContext>
  ),
} satisfies Meta<typeof SearchFilterLookup>;
type TStory = StoryObj<typeof SearchFilterLookup>;

const labels: TNestedSearchLabel[] = [
  "2026 Swedish Climate Policy Council Annual Report",
  "BVG Associates",
  "Blue Marine Foundation",
  "Canada's Net Zero Advisory Body",
  "Canadian Climate Institute",
  "Carbon Trust",
  "Climate Integrate",
  "Climate Policy",
  "Colombia, Ministry of Mines and Energy",
  "ESMAP World Bank Group",
  "Ecology and Evolution",
  "Energy Policy",
  "Environmental Science and Policy",
  "European Commission: Directorate-General for Trade",
  "European Scientific Advisory Board",
  "FOWIND",
  "German Council of Experts on Climate Change",
  "Global Wind Energy Council",
  "Government of Trinidad and Tobago",
  "Green Energy Strategy Institute",
  "Haut Conseil Pour Le Climat",
  "IRENA Coalition for Action",
  "Institute of Marine Engineering, Science and Technology",
  "Inter-American Development Bank",
  "International Renewable Energy Agency",
  "International Union for Conservation of Nature",
  "Journal of Cleaner Production",
  "Malta Climate Action Authority",
  "Marine Environmental Research",
  "Marine Policy",
  "Mitsubishi Research Institute",
  "National Renewable Energy Laboratory",
  "Natural England",
  "Natuur & Milieu",
  "OREAC",
  "Ocean Energy Pathway",
  "Ocean Winds",
  "Ocean and Coastal Management",
  "Offshore Coalition for Energy and Nature",
  "Offshore Renewable Energy (ORE) Catapult",
  "Presidential Climate Change Commission",
  "Regen",
  "Renewable Energy Institute",
  "Renewables Grid Initiative",
  "Royal Society for the Protection of Birds",
  "Sistema Guatemalteco de Ciencias del Cambio Climático",
  "Solutions for Our Climate",
  "Swedish Climate Policy Council",
  "The Biodiversity Consultancy",
  "The Blue Economy Cooperative Research Centre",
  "Tim Pick",
  "UK Climate Change Committee",
  "US Department of Energy",
  "United Kingdom Climate Change Committee",
  "Vattenfall",
  "Westwood Global Energy Group",
  "World Bank",
  "World Bank Group",
  "World Forum Offshore Wind",
  "World Resources Institute",
].map((value) => ({
  id: `author::${value}`,
  type: "author",
  value,
  children: [] as TNestedSearchLabel[],
}));

export default meta;

export const Default: TStory = {
  args: {
    ancestorPath: [],
    labels,
  },
};
