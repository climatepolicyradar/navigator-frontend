import { Meta, StoryObj } from "@storybook/react/*";
import { Modal } from "./Modal";
import { useState } from "react";
import { Button } from "@/components/atoms/button/Button";
import { Heading } from "@/components/typography/Heading";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { ExternalLink } from "@/components/ExternalLink";

const meta = {
  title: "Molecules/Modal",
  component: Modal,
  argTypes: {
    children: { control: false },
    isOpen: { control: false },
    onClose: { control: false },
  },
} satisfies Meta<typeof Modal>;
type Story = StoryObj<typeof Modal>;

export default meta;

const useModalContext = ({ children, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Modal {...props} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {children}
      </Modal>
    </>
  );
};

export const Primary: Story = {
  args: {
    children: "Hello modal!",
    showCloseButton: false,
  },
  render: useModalContext,
};

export const DownloadCSV: Story = {
  name: "Download CSV",
  args: {
    children: (
      <div className="flex flex-col items-center">
        <Heading level={3}>Download CSV</Heading>
        <p className="mb-4">
          Please read our <LinkWithQuery href="/terms-of-use">terms of use</LinkWithQuery>, including any specific terms relevant to commercial use.
          Please contact{" "}
          <ExternalLink url="mailto:partners@climatepolicyradar.org" className="underline text-blue-600 hover:text-blue-800">
            partners@climatepolicyradar.org
          </ExternalLink>{" "}
          with any questions. Note that the actual number of entries returned may be 1 or 2 below the total indicated on the search results page.
        </p>
        <div className="flex">
          <Button rounded>Download</Button>
          <Button rounded variant="ghost">
            Cancel
          </Button>
        </div>
      </div>
    ),
  },
  render: useModalContext,
};
