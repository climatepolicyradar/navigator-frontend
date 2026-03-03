import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InteractiveTable } from "./InteractiveTable";

const columns = [
  { id: "name", name: "Name", sortable: true },
  { id: "filingDate", name: "Filing Date", sortable: true },
];

const rows = [
  { id: "1", cells: { name: "Doc A", filingDate: { label: "03/22/2023", value: 20230322 } } },
  { id: "2", cells: { name: "Doc B", filingDate: { label: "01/15/2024", value: 20240115 } } },
  { id: "3", cells: { name: "Doc C", filingDate: null } },
];

describe("InteractiveTable", () => {
  test("renders rows in default order when no defaultSort is provided", () => {
    render(<InteractiveTable columns={columns} rows={rows} />);

    const renderedRows = screen.getAllByRole("row").slice(1);
    expect(renderedRows[0]).toHaveTextContent("Doc A");
    expect(renderedRows[1]).toHaveTextContent("Doc B");
  });

  test("renders rows sorted when defaultSort is provided", () => {
    render(<InteractiveTable columns={columns} rows={rows} defaultSort={{ column: "filingDate", order: "desc" }} />);

    const renderedRows = screen.getAllByRole("row").slice(1);
    expect(renderedRows[0]).toHaveTextContent("Doc B"); // 2024 first
    expect(renderedRows[1]).toHaveTextContent("Doc A"); // 2023 second
  });

  test("null values always sort to the bottom", () => {
    render(<InteractiveTable columns={columns} rows={rows} defaultSort={{ column: "filingDate", order: "asc" }} />);

    const renderedRows = screen.getAllByRole("row").slice(1);
    expect(renderedRows[renderedRows.length - 1]).toHaveTextContent("Doc C");
  });

  test("clicking sort option reorders rows", async () => {
    render(<InteractiveTable columns={columns} rows={rows} />);

    const filingDateHeader = screen.getByRole("columnheader", { name: /filing date/i });
    const sortButton = within(filingDateHeader).getByRole("button");

    await userEvent.click(sortButton);

    const descendingOption = await screen.findByRole("menuitem", { name: "Descending" });
    await userEvent.click(descendingOption);

    const renderedRows = screen.getAllByRole("row").slice(1);
    expect(renderedRows[0]).toHaveTextContent("Doc B");
  });
});
