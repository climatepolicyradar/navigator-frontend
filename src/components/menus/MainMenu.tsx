import { useState, useRef } from "react";

import { Icon } from "@/components/atoms/icon/Icon";
import DropdownMenuItem from "@/components/menus/DropdownMenuItem";
import DropdownMenuWrapper from "@/components/menus/DropdownMenuWrapper";
import useOutsideAlerter from "@/hooks/useOutsideAlerter";

interface IProps {
  iconClass?: string;
}

const MainMenu = ({ iconClass = "text-white" }: IProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  useOutsideAlerter(menuRef, () => setShowMenu(false));

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  return (
    <div ref={menuRef} className="relative z-[41]">
      <button data-cy="menu-icon" onClick={toggleMenu} className={iconClass} aria-label="Toggle menu">
        <Icon name="menu" />
      </button>
      {showMenu && (
        <div className="absolute right-0 z-50">
          <DropdownMenuWrapper>
            <DropdownMenuItem external={true} href="https://climatepolicyradar.org" title="About us" first={true} setShowMenu={setShowMenu} />
            <DropdownMenuItem
              external={true}
              href="https://github.com/climatepolicyradar/methodology"
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
