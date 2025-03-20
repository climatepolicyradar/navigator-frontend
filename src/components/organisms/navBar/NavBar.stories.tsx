import { Meta, StoryObj } from "@storybook/react/*";
import { NavBar } from "./NavBar";

const meta = {
  title: "Organisms/Surfaces/NavBar",
  component: NavBar,
} satisfies Meta<typeof NavBar>;
type Story = StoryObj<typeof NavBar>;

export default meta;

export { SearchPage, GeographyPage, FamilyPage, DocumentPage } from "../../molecules/navSearch/NavSearch.stories";
