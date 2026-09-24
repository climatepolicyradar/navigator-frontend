import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ID_SEPARATOR } from "@/constants/chars";
import { TLabel } from "@/types";

import { Geographies } from "./Geographies";

const geographyLabel = (type: string, id: string, value: string, children: TLabel[] = []): TLabel => ({
  id: [type, id].join(ID_SEPARATOR),
  type,
  value,
  children,
});

const manyCountries = [
  geographyLabel("country", "CAN", "Canada"),
  geographyLabel("country", "USA", "United States"),
  geographyLabel("country", "GBR", "United Kingdom"),
  geographyLabel("country", "FRA", "France"),
  geographyLabel("country", "DEU", "Germany"),
];

const meta = {
  title: "Molecules/Geographies/Geographies",
  component: Geographies,
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <div className="text-base text-text-primary font-normal leading-5">
      <Geographies {...args} />
    </div>
  ),
} satisfies Meta<typeof Geographies>;
type TStory = StoryObj<typeof Geographies>;

export default meta;

export const Country: TStory = {
  args: {
    geographyLabels: [geographyLabel("country", "CAN", "Canada")],
  },
};

export const Countries: TStory = {
  args: {
    geographyLabels: manyCountries.slice(0, 2),
  },
};

export const LimitedNoAction: TStory = {
  name: "Limited (no action)",
  args: {
    geographyLabels: manyCountries,
    limit: 3,
  },
};

export const LimitedAction: TStory = {
  name: "Limited (with action)",
  args: {
    geographyLabels: manyCountries,
    limit: 3,
    limitOnClick: () => alert("Show all geographies"),
    limitSuffix: ["other", "others"],
  },
};

export const Subdivision: TStory = {
  args: {
    geographyLabels: [geographyLabel("subdivision", "Ohio", "Ohio")],
  },
};

export const CountryAndSubdivision: TStory = {
  name: "Country and subdivision",
  args: {
    geographyLabels: [geographyLabel("country", "USA", "United States", [geographyLabel("subdivision", "Ohio", "Ohio")])],
    separatorClasses: "text-text-tertiary",
  },
};

export const CountryAndSubdivisions: TStory = {
  name: "Country and subdivisions",
  args: {
    geographyLabels: [
      geographyLabel("country", "USA", "United States", [
        geographyLabel("subdivision", "Pennsylvania", "Pennsylvania"),
        geographyLabel("subdivision", "Ohio", "Ohio"),
      ]),
    ],
  },
};

export const International: TStory = {
  args: {
    geographyLabels: [geographyLabel("country", "XAB", "International")],
  },
};

export const Region: TStory = {
  args: {
    geographyLabels: [geographyLabel("region", "EUR", "Europe")],
  },
};

export const Regions: TStory = {
  args: {
    geographyLabels: [geographyLabel("region", "EUR", "Europe"), geographyLabel("region", "SAS", "South Asia")],
  },
};

export const NoGeography: TStory = {
  name: "No geography",
  args: {
    geographyLabels: [],
  },
};
