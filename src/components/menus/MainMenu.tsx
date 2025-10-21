import { LucideMenu } from "lucide-react";
import { useState, useRef } from "react";

import DropdownMenuItem from "@/components/menus/DropdownMenuItem";
import DropdownMenuWrapper from "@/components/menus/DropdownMenuWrapper";
import useOutsideAlerter from "@/hooks/useOutsideAlerter";

const MainMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  useOutsideAlerter(menuRef, () => setShowMenu(false));

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  return (
    <div ref={menuRef} className="relative z-[41]">
      <button className="flex items-center gap-1 text-gray-950 font-medium" onClick={toggleMenu} aria-label="Toggle menu" data-cy="menu-icon">
        <LucideMenu size={16} className="text-brand" /> Menu
      </button>
      {showMenu && (
        <div className="absolute right-0 z-50">
          <DropdownMenuWrapper>
            <DropdownMenuItem external={true} href="https://climatepolicyradar.org" title="About us" first={true} setShowMenu={setShowMenu} />
            <DropdownMenuItem
              external={true}
              href="https://github.com/climatepolicyradar/methodology/blob/main/METHODOLOGY.md"
              title="Methodology"
              setShowMenu={setShowMenu}
            />
            <DropdownMenuItem href="/faq" title="FAQ" setShowMenu={setShowMenu} />
          </DropdownMenuWrapper>
        </div>
      )}
    </div>
  );
};
export default MainMenu;
