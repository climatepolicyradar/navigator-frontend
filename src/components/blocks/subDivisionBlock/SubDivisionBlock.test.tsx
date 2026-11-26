import { render, screen } from "@testing-library/react";
import * as nextRouterMock from "next-router-mock";

import { TNestedSearchLabel } from "@/types";

import { SubDivisionBlock } from "./SubDivisionBlock";

vi.mock("next/router", () => nextRouterMock);

const label = (id: string, value: string, count = 0, children: TNestedSearchLabel[] = []): TNestedSearchLabel => ({
  id,
  type: id.split("::")[0],
  value,
  alternative_labels: [],
  count,
  children,
});

describe("SubDivisionBlock", () => {
  it("links a subdivision with documents and greys out one without", () => {
    render(
      <SubDivisionBlock
        country={label("country::ESP", "Spain", 2, [label("subdivision::ES-CT", "Catalunya", 2), label("subdivision::ES-GA", "Galicia")])}
      />
    );

    expect(screen.getByRole("link", { name: "Catalunya" })).toHaveAttribute("href", "/geographies/es-ct");
    expect(screen.getByText("Galicia")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Galicia" })).not.toBeInTheDocument();
  });

  it("renders nothing when no subdivision has documents", () => {
    const { container } = render(<SubDivisionBlock country={label("country::ESP", "Spain", 0, [label("subdivision::ES-GA", "Galicia")])} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("leaves out the excluded subdivision", () => {
    render(
      <SubDivisionBlock
        country={label("country::ESP", "Spain", 3, [label("subdivision::ES-CT", "Catalunya", 2), label("subdivision::ES-GA", "Galicia", 1)])}
        exclude="es-ct"
      />
    );

    expect(screen.queryByText("Catalunya")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Galicia" })).toBeInTheDocument();
  });

  it("only shows the four UK nations", () => {
    render(
      <SubDivisionBlock
        country={label("country::GBR", "United Kingdom", 7, [
          label("subdivision::GB-SCT", "Scotland", 7),
          label("subdivision::GB-ENG", "England"),
          label("subdivision::GB-AND", "Aberdeenshire"),
        ])}
      />
    );

    expect(screen.getByRole("link", { name: "Scotland" })).toBeInTheDocument();
    expect(screen.getByText("England")).toBeInTheDocument();
    expect(screen.queryByText("Aberdeenshire")).not.toBeInTheDocument();
  });
});
