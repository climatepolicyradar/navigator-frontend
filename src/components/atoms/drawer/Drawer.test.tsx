import { render, screen } from "@testing-library/react";

import { Drawer } from "./Drawer";

// The attribute PostHog's `scroll_root_selector` looks for, so scroll depth is measured against
// the drawer the user is actually scrolling rather than the page behind it.
const scrollRoots = () => Array.from(document.querySelectorAll("[data-drawer-scroll]"));

const drawerContent = (name: string) => screen.getByText(name).closest("[data-drawer-scroll]");

describe("Drawer", () => {
  it("marks its content as the scroll root only when asked to", () => {
    const { rerender } = render(<Drawer open>untracked</Drawer>);
    expect(scrollRoots()).toHaveLength(0);

    rerender(
      <Drawer open trackScroll>
        tracked
      </Drawer>
    );
    expect(scrollRoots()).toEqual([drawerContent("tracked")]);
  });

  it("hands the scroll root to the drawer opened on top, and back again when it closes", () => {
    const Drawers = ({ nestedOpen }: { nestedOpen: boolean }) => (
      <Drawer open trackScroll>
        underneath
        {nestedOpen && (
          <Drawer open trackScroll>
            on top
          </Drawer>
        )}
      </Drawer>
    );

    const { rerender } = render(<Drawers nestedOpen={false} />);
    expect(scrollRoots()).toEqual([drawerContent("underneath")]);

    rerender(<Drawers nestedOpen={true} />);
    expect(scrollRoots()).toEqual([drawerContent("on top")]);

    rerender(<Drawers nestedOpen={false} />);
    expect(scrollRoots()).toEqual([drawerContent("underneath")]);
  });
});
