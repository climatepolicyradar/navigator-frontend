import { render, screen, fireEvent } from "@testing-library/react";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("does not render Back and Next buttons by default", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
  });

  it("renders Back and Next buttons", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} showNextPrevButtons={true} />);
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("disables Back on the first page", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} showNextPrevButtons={true} />);
    expect(screen.getByRole("button", { name: /back/i })).toBeDisabled();
  });

  it("disables Next on the last page", () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} showNextPrevButtons={true} />);
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("renders all page buttons when totalPages is small", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
    [1, 2, 3, 4, 5].forEach((page) => {
      expect(screen.getByRole("button", { name: String(page) })).toBeInTheDocument();
    });
  });

  it("disables the current page button", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "3" })).toBeDisabled();
  });

  it("calls onPageChange with the next page when Next is clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} showNextPrevButtons={true} />);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange with the previous page when Back is clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} showNextPrevButtons={true} />);
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with the selected page when a page button is clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("renders ellipsis for large page counts when current page is in the middle", () => {
    render(<Pagination currentPage={10} totalPages={20} onPageChange={() => {}} />);
    expect(screen.getAllByText("…")).toHaveLength(2);
  });
});
