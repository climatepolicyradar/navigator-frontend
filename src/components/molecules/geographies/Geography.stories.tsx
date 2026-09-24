import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ID_SEPARATOR } from "@/constants/chars";

import { Geography } from "./Geography";

const meta = {
  title: "Molecules/Geographies/Geography",
  component: Geography,
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <div className="text-base text-text-primary font-normal leading-5">
      <Geography {...args} />
    </div>
  ),
} satisfies Meta<typeof Geography>;
type TStory = StoryObj<typeof Geography>;

export default meta;

export const Country: TStory = {
  args: {
    geographyLabel: {
      id: ["country", "CAN"].join(ID_SEPARATOR),
      type: "country",
      value: "Canada",
      children: [],
    },
  },
};

export const CountryWithSlugConversion: TStory = {
  name: "Country (conversion)",
  args: {
    geographyLabel: {
      id: ["country", "USA"].join(ID_SEPARATOR),
      type: "country",
      value: "United States",
      children: [],
    },
  },
};

export const Subdivision: TStory = {
  args: {
    geographyLabel: {
      id: ["subdivision", "Ohio"].join(ID_SEPARATOR),
      type: "subdivision",
      value: "Ohio",
      children: [],
    },
  },
};

export const International: TStory = {
  args: {
    geographyLabel: {
      id: ["country", "XAB"].join(ID_SEPARATOR),
      type: "country",
      value: "International",
      children: [],
    },
  },
};

export const Region: TStory = {
  args: {
    geographyLabel: {
      id: ["region", "EUR"].join(ID_SEPARATOR),
      type: "region",
      value: "Europe",
      children: [],
    },
  },
};
