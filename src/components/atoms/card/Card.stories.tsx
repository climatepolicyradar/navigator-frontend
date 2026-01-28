import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Copy } from "lucide-react";

import { Card } from "./Card";
import { Button } from "../button/Button";

const meta = {
  title: "Atoms/Card",
  component: Card,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof Card>;
type TStory = StoryObj<typeof Card>;

export default meta;

const render =
  (containerClasses: string) =>
  // eslint-disable-next-line react/display-name
  ({ ...props }) => (
    <div className={containerClasses}>
      <Card {...props} />
    </div>
  );

const children = (
  <>
    <div className={`mb-4 flex justify-between opacity-80`}>
      <span className="font-medium text-[13px]">Page 16</span>
      <Copy height="16" width="16" />
    </div>
    <p className="font-normal">
      (PM2.5), the pollutant most associated with negative health impacts. The impact quantified here are premature deaths associated with PM2.5
      exposure, although air pollution has a much wider effect on health, including non-fatal effects on the respiratory and cardiovascular systems.
      In Nigeria in 2010, fine particulate matter exposure was associated with about 61,000 premature deaths with the most affected being children of
      less than 5 years of age. Environmental effects are defined as effects on crops and forests, while climate effects are defined as global warming
      or cooling of the atmosphere.
    </p>
  </>
);

export const Outlined: TStory = {
  args: {
    children,
    className: "",
    color: "brand",
    variant: "outlined",
  },
  render: render("max-4-[400px]"),
};

export const Solid: TStory = {
  args: {
    children,
    className: "",
    color: "brand",
    variant: "solid",
  },
  render: render("max-4-[400px]"),
};

export const CookieConsent: TStory = {
  args: {
    children: (
      <>
        <p className="text-base leading-normal font-semibold text-text-primary">Cookies and your privacy</p>
        <p className="mt-2 mb-4 text-sm leading-normal font-normal text-text-primary">
          We take your trust and privacy seriously. Climate Policy Radar uses cookies to make our site work optimally, analyse traffic to our website
          and improve your experience. Read our{" "}
          <a href="#" className="underline">
            privacy and cookie policy
          </a>{" "}
          to learn more. By accepting cookies you will help us make our site better, but you can reject them if you wish.
        </p>
        <div className="flex gap-2">
          <Button color="mono" size="small">
            Accept
          </Button>
          <Button color="mono" size="small" variant="ghost" className="text-text-secondary hover:text-text-primary">
            Reject
          </Button>
        </div>
      </>
    ),
    className: "bg-surface-ui select-none",
    color: "mono",
    variant: "outlined",
  },
  render: render("max-w-[525px]"),
};
