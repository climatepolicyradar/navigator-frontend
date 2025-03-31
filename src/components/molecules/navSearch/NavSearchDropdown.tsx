import { useEffect, useRef, useState } from "react";
import { LuChevronsUpDown } from "react-icons/lu";

interface NavSearchDropdownProps {
  contextualSearchName: string;
  isEverything: boolean;
  setIsEverything: (newValue: boolean) => void;
}

type DropdownOption = {
  name: string;
  newIsEverythingValue: boolean;
};

export const NavSearchDropdown = ({ contextualSearchName, isEverything, setIsEverything }: NavSearchDropdownProps) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleFocusOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleTab = (event: KeyboardEvent) => {
      if (event.key === "Tab" && ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleFocusOutside, true);
    document.addEventListener("keyup", handleTab, true);

    return () => {
      document.removeEventListener("click", handleFocusOutside, true);
      document.removeEventListener("keyup", handleTab, true);
    };
  }, [ref]);

  // Show the other option below the currently selected one
  const dropdownOptions: DropdownOption[] = [
    {
      name: "Everything",
      newIsEverythingValue: true,
    },
    {
      name: contextualSearchName,
      newIsEverythingValue: false,
    },
  ];
  if (!isEverything) dropdownOptions.reverse();

  const handleClick =
    (newValue: boolean): React.MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      event.preventDefault();
      setIsOpen((current) => !current);
      if (isOpen) setIsEverything(newValue);
    };

  return (
    <div
      ref={ref}
      className={`flex flex-col bg-surface-light -outline-offset-1 outline-border-lighter rounded-md ${isOpen ? "p-1 gap-0.5 outline" : ""}`}
    >
      {dropdownOptions.map((option, optionIndex) => (
        <button
          key={option.name}
          type="button"
          onClick={handleClick(option.newIsEverythingValue)}
          className={`w-full flex items-center justify-between gap-2 text-sm leading-4 text-nowrap cursor-pointer
          ${
            isOpen
              ? "h-[37px] px-2 hocus:bg-surface-mono-dark rounded-xs text-text-primary hocus:text-text-light focus:outline-0"
              : "h-[45px] px-3 bg-surface-ui rounded-md hover:text-text-primary"
          }
          ${optionIndex > 0 && !isOpen ? "!h-0 overflow-hidden" : ""}`}
        >
          {option.name}
          <div className={isOpen ? "invisible" : ""}>
            <LuChevronsUpDown height="12" width="12" />
          </div>
        </button>
      ))}
    </div>
  );
};
