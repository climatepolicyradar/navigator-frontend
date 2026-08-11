import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { Pagination } from "./Pagination";

const meta = {
  title: "Molecules/Pagination",
  component: Pagination,
  argTypes: {
    onPageChange: { control: false },
  },
} satisfies Meta<typeof Pagination>;
type TStory = StoryObj<typeof Pagination>;

export default meta;

const usePaginationRender = ({ totalPages, currentPage: initialPage }: React.ComponentProps<typeof Pagination>) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  return <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />;
};

export const Few: TStory = {
  args: {
    currentPage: 2,
    totalPages: 4,
  },
  render: usePaginationRender,
};

export const Many: TStory = {
  args: {
    currentPage: 8,
    totalPages: 15,
  },
  render: usePaginationRender,
};
