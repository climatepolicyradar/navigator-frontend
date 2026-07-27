import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { Pagination } from "./Pagination";

const meta = {
  title: "Molecules/Pagination",
  component: Pagination,
  argTypes: {
    onPageChange: { control: false },
    currentPage: { control: false },
  },
} satisfies Meta<typeof Pagination>;
type TStory = StoryObj<typeof Pagination>;

export default meta;

const usePaginationRender = ({ totalPages, currentPage: initialPage, showNextPrevButtons }: React.ComponentProps<typeof Pagination>) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  return <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} showNextPrevButtons={showNextPrevButtons} />;
};

export const WithNextPrevButtons: TStory = {
  args: {
    currentPage: 1,
    totalPages: 20,
    showNextPrevButtons: true,
  },
  render: usePaginationRender,
};

export const FirstPage: TStory = {
  args: {
    currentPage: 1,
    totalPages: 20,
  },
  render: usePaginationRender,
};

export const LastPage: TStory = {
  args: {
    currentPage: 20,
    totalPages: 20,
  },
  render: usePaginationRender,
};

export const MiddlePage: TStory = {
  args: {
    currentPage: 10,
    totalPages: 20,
  },
  render: usePaginationRender,
};

export const FewPages: TStory = {
  args: {
    currentPage: 3,
    totalPages: 5,
  },
  render: usePaginationRender,
};
