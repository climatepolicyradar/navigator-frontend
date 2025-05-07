import { Meta, StoryObj } from "@storybook/react/*";
import { Info } from "./Info";

const meta = {
  title: "Molecules/Info",
  component: Info,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: "text" },
  },
} satisfies Meta<typeof Info>;
type Story = StoryObj<typeof Info>;

export default meta;

export const Generic: Story = {
  args: {
    children: "Here is some more info!",
  },
};

export const Filters: Story = {
  argTypes: {
    children: { control: false },
  },
  args: {
    children: (
      <>
        <span className="font-bold">About</span>
        <p className="my-2">Narrow down your results using the filter below. You can also combine these with a search term.</p>
        <a href="#" className="underline">
          Learn more
        </a>
      </>
    ),
  },
  render: ({ ...props }) => (
    <p className="flex gap-1.5 items-center">
      <span className="font-medium">Filters</span>
      <Info {...props} />
    </p>
  ),
};
