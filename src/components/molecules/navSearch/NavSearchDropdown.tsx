import { ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IProps {
  contextualSearchName: string;
  isEverything: boolean;
  setIsEverything: (newValue: boolean) => void;
}

type TDropdownOption = {
  name: string;
  newIsEverythingValue: boolean;
};

export const NavSearchDropdown = ({ contextualSearchName, isEverything, setIsEverything }: IProps) => {
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
  const dropdownOptions: TDropdownOption[] = [
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

  const handleClick = (newValue: boolean) => {
    setIsOpen((current) => !current);
    if (isOpen) setIsEverything(newValue);
  };

  return (
    <div className="h-[40px] overflow-visible">
      <div
        ref={ref}
        className={`flex flex-col bg-surface-light -outline-offset-1 outline-border-lighter rounded-md ${isOpen ? "p-1 gap-0.5 outline" : ""}`}
      >
        {dropdownOptions.map((option, optionIndex) => (
          <button
            key={option.name}
            type="button"
            onClick={() => handleClick(option.newIsEverythingValue)}
            className={`w-full flex items-center justify-between gap-2 text-sm leading-4 font-medium text-nowrap cursor-pointer
          ${
            isOpen
              ? "h-[32px] px-2 hocus:bg-surface-mono-dark rounded-xs text-text-primary hocus:text-text-light focus:outline-0"
              : "h-[40px] px-3 bg-surface-ui rounded-md hover:text-text-primary"
          }
          ${optionIndex > 0 && !isOpen ? "!h-0 overflow-hidden" : ""}`}
          >
            {option.name}
            <div className={isOpen ? "invisible" : ""}>
              <ChevronsUpDown height="12" width="12" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
