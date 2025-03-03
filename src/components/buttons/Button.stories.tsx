import { Meta, StoryObj } from "@storybook/react/*";
import { Button } from "./NewButton";
import { Icon } from "@components/icon/Icon";
import { LuMoveUpRight } from "react-icons/lu";
import OldButton from "./Button";
import Close from "./Close";
import FilterTag from "./FilterTag";
import FilterToggle from "./FilterToggle";
import MatchesButton from "./MatchesButton";
import { SearchMatchesButton } from "./SearchMatchesButton";

const meta = {
  title: "New/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;
type Story = StoryObj<typeof Button>;

export default meta;

export const Small: Story = {
  args: {
    children: "Small",
    color: "brand",
    disabled: false,
    size: "small",
    rounded: false,
    variant: "solid",
  },
};

export const Medium: Story = {
  args: {
    children: "Medium",
    color: "brand",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "solid",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    color: "brand",
    disabled: false,
    size: "large",
    rounded: false,
    variant: "solid",
  },
};

export const Rounded: Story = {
  args: {
    children: "Rounded",
    color: "brand",
    disabled: false,
    size: "medium",
    rounded: true,
    variant: "solid",
  },
};

export const Faded: Story = {
  args: {
    children: "Faded",
    color: "brand",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "faded",
  },
};

export const Outlined: Story = {
  args: {
    children: "Outlined",
    color: "mono",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "outlined",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    color: "mono",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "ghost",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    color: "brand",
    disabled: true,
    size: "medium",
    rounded: false,
    variant: "solid",
  },
};

export const IconLeading: Story = {
  args: {
    children: (
      <>
        <Icon name="download" height="16" width="16" />
        <span className="ml-2">Download as PDF</span>
      </>
    ),
    color: "brand",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "solid",
  },
};

export const IconTrailing: Story = {
  args: {
    children: (
      <>
        <span>View source document</span>
        <LuMoveUpRight className="ml-2" height="16" width="16" />
      </>
    ),
    color: "mono",
    disabled: false,
    size: "medium",
    rounded: true,
    variant: "outlined",
  },
};

/**
 * Render all existing instances of button components.
 * This story will be removed once buttons have been reworked and consolidated.
 */

type ButtonUsage = {
  component: string;
  filepath: string;
  usage: React.ReactNode;
};

const onClick = () => {};
const buttonUsage: ButtonUsage[] = [
  {
    component: "Button",
    filepath: "src/components/cookies/CookieConsent.tsx",
    usage: (
      <OldButton thin data-cy="cookie-consent-accept">
        Accept
      </OldButton>
    ),
  },
  {
    component: "Button",
    filepath: "src/components/error/PageLevel.tsx",
    usage: <OldButton thin>Restart</OldButton>,
  },
  {
    component: "Button",
    filepath: "src/components/error/TopLevel.tsx",
    usage: <OldButton thin>Restart</OldButton>,
  },
  {
    component: "Button",
    filepath: "src/components/filters/DateRange.tsx",
    usage: <OldButton extraClasses="w-auto !inline">Apply</OldButton>,
  },
  {
    component: "Button",
    filepath: "src/components/modals/DownloadCsv.tsx",
    usage: <OldButton>Download</OldButton>,
  },
  {
    component: "Button",
    filepath: "src/pages/_feature-flags.tsx",
    usage: <OldButton id="beta-button">Feature Flags</OldButton>,
  },
  {
    component: "Button",
    filepath: "src/components/documents/ConceptsDocumentViewer.tsx",
    usage: (
      <OldButton
        color="dark-dark"
        data-cy="view-document-viewer-concept"
        extraClasses="flex items-center text-[14px] font-normal pt-1 pb-1 bg-black text-white border-none"
      >
        ← Back
      </OldButton>
    ),
  },
  {
    component: "Button",
    filepath: "src/components/concepts/ConceptsPanel.tsx",
    usage: (
      <OldButton
        color="clear-blue"
        data-cy="view-document-viewer-concept"
        extraClasses="capitalize flex items-center text-neutral-600 text-sm font-normal leading-tight"
      >
        Concept Label 10
      </OldButton>
    ),
  },
  {
    component: "Button",
    filepath: "src/components/documents/DocumentHead.tsx",
    usage: (
      <OldButton color="clear" data-cy="view-source" extraClasses="flex items-center text-sm">
        Other documents in this entry (25)
      </OldButton>
    ),
  },
  {
    component: "Button",
    filepath: "src/components/documents/DocumentHead.tsx",
    usage: (
      <OldButton color="clear" data-cy="view-source" extraClasses="flex items-center text-sm">
        <span className="mr-2">View source document</span>
        <LuMoveUpRight height="16" width="16" />
      </OldButton>
    ),
  },
  {
    component: "Button",
    filepath: "src/components/drawer/FamilyMatchesDrawer.tsx",
    usage: (
      <OldButton color="clear" data-cy="view-document-button" extraClasses="text-sm text-blue-600">
        View all matches highlighted in document
      </OldButton>
    ),
  },
  {
    component: "Button",
    filepath: "src/pages/document/[id].tsx",
    usage: (
      <OldButton color="secondary" extraClasses="flex gap-2 items-center">
        <Icon name="downChevron" /> View more targets
      </OldButton>
    ),
  },
  {
    component: "Button",
    filepath: "src/pages/geographies/[id].tsx",
    usage: (
      <OldButton color="secondary" extraClasses="flex gap-2 items-center">
        <Icon name="downChevron" /> View more targets
      </OldButton>
    ),
  },
  {
    component: "Button",
    filepath: "src/pages/document/[id].tsx",
    usage: (
      <OldButton color="secondary" extraClasses="flex gap-2 items-center">
        <div className="rotate-180">
          <Icon name="downChevron" />
        </div>{" "}
        Hide targets
      </OldButton>
    ),
  },
  {
    component: "Button",
    filepath: "src/pages/geographies/[id].tsx",
    usage: (
      <OldButton color="secondary" extraClasses="flex gap-2 items-center">
        <div className="rotate-180">
          <Icon name="downChevron" />
        </div>{" "}
        Hide targets
      </OldButton>
    ),
  },
  {
    component: "Button",
    filepath: "src/pages/geographies/[id].tsx",
    usage: <OldButton color="secondary">View more documents</OldButton>,
  },
  {
    component: "Button",
    filepath: "src/components/cookies/CookieConsent.tsx",
    usage: (
      <OldButton color="ghost" thin data-cy="cookie-consent-reject">
        Reject
      </OldButton>
    ),
  },
  {
    component: "Button",
    filepath: "src/components/modals/DownloadCsv.tsx",
    usage: <OldButton color="ghost">Cancel</OldButton>,
  },
  {
    component: "Button",
    filepath: "themes/cclw/components/Instructions.tsx",
    usage: (
      <OldButton extraClasses="flex gap-2 items-center" color="dark-dark">
        Or try exploring by country{" "}
        <span className="hover:animate-none animate-bounce">
          <Icon name="downArrow" />
        </span>
      </OldButton>
    ),
  },
  {
    component: "Button",
    filepath: "themes/cclw/components/LandingSearchForm.tsx",
    usage: (
      <OldButton thin color="dark">
        Term or Filter Value
      </OldButton>
    ),
  },
  {
    component: "Button",
    filepath: "themes/mcf/components/LandingSearchForm.tsx",
    usage: (
      <OldButton thin color="clear-underline">
        Term or Filter Value
      </OldButton>
    ),
  },
  {
    component: "Close",
    filepath: "src/components/drawer/Drawer.tsx",
    usage: <Close onClick={onClick} size="14" />,
  },
  {
    component: "Close",
    filepath: "themes/cpr/components/LandingSearchForm.tsx",
    usage: <Close onClick={onClick} size="16" />,
  },
  {
    component: "Close",
    filepath: "src/components/modals/Popup.tsx",
    usage: <Close onClick={onClick} size="20" />,
  },
  {
    component: "FilterTag",
    filepath: "src/components/filters/MultiList.tsx",
    usage: <FilterTag onClick={onClick} item="United Kingdom" />,
  },
  {
    component: "FilterToggle",
    filepath: "src/pages/search/index.tsx",
    usage: <FilterToggle toggle={onClick} isOpen={true} />,
  },
  {
    component: "MatchesButton",
    filepath: "src/components/document/FamilyDocument.tsx",
    usage: <MatchesButton dataAttribute={"foo"} count={12} familyMatches={20} />,
  },
  {
    component: "SearchMatches",
    filepath: "src/components/buttons/SearchMatchesButton.tsx",
    usage: <SearchMatchesButton count={30} dataAttribute="test" onClick={onClick} active={true} />,
  },
];

export const ExistingButtonUsage: Story = {
  argTypes: {
    children: { control: false },
    color: { control: false },
    disabled: { control: false },
    rounded: { control: false },
    size: { control: false },
    variant: { control: false },
  },
  render: () => (
    <div className="grid grid-cols-3 gap-10 p-8">
      <p className="font-bold text-xl">Usage</p>
      <p className="font-bold text-xl">Component</p>
      <p className="font-bold text-xl">Filepath</p>
      {buttonUsage.map(({ component, filepath, usage }) => (
        <>
          <div>
            <div className="inline-block">{usage}</div>
          </div>
          <span>{component}</span>
          <span>{filepath}</span>
        </>
      ))}
    </div>
  ),
};
