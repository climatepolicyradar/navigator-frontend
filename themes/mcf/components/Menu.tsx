import { useState, useRef, useCallback } from "react";

import { Icon } from "@/components/atoms/icon/Icon";
import DropdownMenuItem from "@/components/menus/DropdownMenuItem";
import DropdownMenuWrapper from "@/components/menus/DropdownMenuWrapper";
import useOutsideAlerter from "@/hooks/useOutsideAlerter";
import { colors } from "@/mcf/constants/colors";

import menuLinks from "../constants/menuLinks";

export const Menu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  useOutsideAlerter(menuRef, () => setShowMenu(false));

  const toggleMenu = useCallback((e) => {
    e.preventDefault();
    setShowMenu((prev) => !prev);
  }, []);

  return (
    <div ref={menuRef} className="flex items-center relative z-[41]">
      <button data-cy="menu-icon" onClick={toggleMenu} aria-label="Toggle menu">
        <Icon name="menu" color={colors.mcf.mainApp} width="32" height="32" />
      </button>
      {showMenu && (
        <div className="absolute right-0 top-[100%] z-50">
          <DropdownMenuWrapper>
            {menuLinks.map((link, index) => (
              <DropdownMenuItem key={index} {...link} title={link.text} setShowMenu={setShowMenu} first={index === 0} cy={`navigation-${link.cy}`} />
            ))}
          </DropdownMenuWrapper>
        </div>
      )}
    </div>
  );
};
