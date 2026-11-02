import { render, screen } from "@testing-library/react";

import { Drawer, DRAWER_SCROLL_ROOT_SELECTOR, DrawerScrollArea } from "./Drawer";

const scrollRoots = () => Array.from(document.querySelectorAll(DRAWER_SCROLL_ROOT_SELECTOR));

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

  it("keeps the scroll root when a nested drawer is rendered but closed", () => {
    // Blocks render their drawers unconditionally, so a closed one must not claim the root
    render(
      <Drawer open trackScroll>
        underneath
        <Drawer open={false} trackScroll>
          never opened
        </Drawer>
      </Drawer>
    );

    expect(scrollRoots()).toEqual([drawerContent("underneath")]);
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

  it("moves the scroll root to its scroll area when self-scrolling", () => {
    render(
      <Drawer open trackScroll selfScrolling>
        <DrawerScrollArea>scrolling panel</DrawerScrollArea>
      </Drawer>
    );

    expect(scrollRoots()).toEqual([drawerContent("scrolling panel")]);
  });

  it("does not mark a self-scrolling drawer's scroll area unless tracked", () => {
    render(
      <Drawer open selfScrolling>
        <DrawerScrollArea>scrolling panel</DrawerScrollArea>
      </Drawer>
    );

    expect(scrollRoots()).toHaveLength(0);
  });

  it("hands the scroll root from a self-scrolling drawer's scroll area to the drawer opened on top", () => {
    const Drawers = ({ nestedOpen }: { nestedOpen: boolean }) => (
      <Drawer open trackScroll selfScrolling>
        <DrawerScrollArea>
          underneath
          {nestedOpen && (
            <Drawer open trackScroll>
              on top
            </Drawer>
          )}
        </DrawerScrollArea>
      </Drawer>
    );

    const { rerender } = render(<Drawers nestedOpen={false} />);
    expect(scrollRoots()).toEqual([drawerContent("underneath")]);

    rerender(<Drawers nestedOpen={true} />);
    expect(scrollRoots()).toEqual([drawerContent("on top")]);
  });
});
