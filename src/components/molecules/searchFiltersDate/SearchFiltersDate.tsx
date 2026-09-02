import { Radio, RadioGroup } from "@base-ui/react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";
import { useContext, useState } from "react";

import { Input } from "@/components/atoms/input/Input";
import { FiltersContext, TDateRange } from "@/context/FiltersContext";
import { TFiltersGroup } from "@/types";

type TRadioValue = number | null | undefined;

type TDateFilterState = {
  radioValue: TRadioValue;
  earliestYear: string;
  latestYear: string;
};

const RADIO_OPTIONS: { label: string; value: TRadioValue | null }[] = [
  { label: "All time", value: null },
  { label: "Last year", value: 1 },
  { label: "Last 5 years", value: 5 },
];

const dateRangeToFilterState = (dateRange: TDateRange): TDateFilterState => {
  if (dateRange === null) return { radioValue: null, earliestYear: "", latestYear: "" };

  const currentYear = new Date().getFullYear();
  const matchedOption = RADIO_OPTIONS.find(
    (option) => typeof option.value === "number" && dateRange[0] === currentYear - option.value && dateRange[1] === currentYear
  );

  if (matchedOption) return { radioValue: matchedOption.value, earliestYear: "", latestYear: "" };

  return { radioValue: undefined, earliestYear: String(dateRange[0]), latestYear: String(dateRange[1]) };
};

const filterStateToDateRange = ({ radioValue, earliestYear, latestYear }: TDateFilterState): TDateRange => {
  if (radioValue === RADIO_OPTIONS[0].value) return null;

  if (radioValue !== undefined) {
    const currentYear = new Date().getFullYear();
    return [currentYear - radioValue, currentYear];
  }

  return [Number(earliestYear), Number(latestYear)];
};

const dateRangesEqual = (a: TDateRange, b: TDateRange): boolean => {
  if (a === null || b === null) return a === b;
  return a[0] === b[0] && a[1] === b[1];
};

const isValidYear = (value: string): boolean => value !== "" && !Number.isNaN(Number(value));

interface IProps {
  filterGroup: TFiltersGroup;
}

export const SearchFiltersDate = ({ filterGroup }: IProps) => {
  const { appliedDateRange, setDateRange } = useContext(FiltersContext);
  const [dateFilterState, setDateFilterState] = useState<TDateFilterState>(() => dateRangeToFilterState(appliedDateRange));
  const [prevAppliedDateRange, setPrevAppliedDateRange] = useState(appliedDateRange); // Avoids needing a useEffect to listen to appliedDateRange changing beyond this component
  const [isOpen, setIsOpen] = useState(false);
  const { radioValue, earliestYear, latestYear } = dateFilterState;

  if (appliedDateRange !== prevAppliedDateRange) {
    setPrevAppliedDateRange(appliedDateRange);
    setDateFilterState(dateRangeToFilterState(appliedDateRange));
  }

  const currentDateRange = filterStateToDateRange(dateFilterState);
  const hasInvalidCustomInput = radioValue === undefined && (!isValidYear(earliestYear) || !isValidYear(latestYear));

  const onRadioValueChange = (value: TRadioValue) => {
    setDateFilterState((prev) => ({ ...prev, radioValue: value }));
  };

  const onEarliestYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilterState((prev) => ({ ...prev, earliestYear: event.target.value, radioValue: undefined }));
  };

  const onLatestYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilterState((prev) => ({ ...prev, latestYear: event.target.value, radioValue: undefined }));
  };

  const onApply = () => {
    setDateRange(currentDateRange);
    setIsOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setDateFilterState(dateRangeToFilterState(appliedDateRange));
  };

  if (filterGroup.container !== "datepicker") return null;

  return (
    <BasePopover.Root open={isOpen} onOpenChange={onOpenChange}>
      <BasePopover.Trigger className="flex gap-2 items-center px-3 py-2 bg-bg-primary data-popup-open:bg-bg-flat text-sm text-text-primary font-medium leading-5 border border-border-normal rounded-full">
        <span>{filterGroup.title}</span>
        <ChevronDown size={16} className="text-elem-icon" />
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner positionMethod="fixed" side="bottom" sideOffset={8} align="start" className="">
          <BasePopover.Popup className="w-95 max-h-[50dvh] px-6 py-5 bg-bg-primary border border-border-normal rounded-xl shadow-2xl overflow-y-auto">
            <BaseAccordion.Root className="flex flex-col gap-6">
              {/* Date range */}
              <BaseAccordion.Item>
                <BaseAccordion.Header>
                  <BaseAccordion.Trigger className="flex items-center text-sm text-text-primary font-medium leading-5 group">
                    Date range
                    <ChevronDown size={14} className="inline ml-1 text-elem-icon transition-transform group-data-panel-open:rotate-180" />
                  </BaseAccordion.Trigger>
                </BaseAccordion.Header>
                <BaseAccordion.Panel>
                  <RadioGroup value={radioValue} onValueChange={onRadioValueChange} className="pt-2 flex flex-col gap-2">
                    {RADIO_OPTIONS.map((option) => (
                      <label key={option.label} className="flex items-center gap-2 text-sm text-text-primary font-normal leading-5 cursor-pointer">
                        <Radio.Root
                          value={option.value}
                          className="flex size-4 shrink-0 items-center justify-center border border-border-input rounded-full p-0 text-white data-checked:bg-inky-blue focus-visible:outline-2 outline-inky-blue outline-offset-2"
                        >
                          <Radio.Indicator className="flex items-center justify-center data-unchecked:hidden before:size-2 before:rounded-full before:bg-current" />
                        </Radio.Root>
                        {option.label}
                      </label>
                    ))}
                  </RadioGroup>
                </BaseAccordion.Panel>
              </BaseAccordion.Item>

              {/* Custom */}
              <BaseAccordion.Item>
                <BaseAccordion.Header>
                  <BaseAccordion.Trigger className="flex items-center text-sm text-text-primary font-medium leading-5 group">
                    Custom
                    <ChevronDown size={14} className="inline ml-1 text-elem-icon transition-transform group-data-panel-open:rotate-180" />
                  </BaseAccordion.Trigger>
                </BaseAccordion.Header>
                <BaseAccordion.Panel>
                  <div className="pt-4 pb-2 flex justify-between gap-6">
                    <div className="w-38 flex flex-col gap-2">
                      <span className="text-sm text-text-primary font-medium leading-5">Earliest year</span>
                      <Input
                        type="number"
                        placeholder="eg: 1992"
                        value={earliestYear}
                        onChange={onEarliestYearChange}
                        containerClasses="bg-white border border-border-normal rounded-sm"
                        inputClasses="w-full py-2.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <div className="w-38 flex flex-col gap-2">
                      <span className="text-sm text-text-primary font-medium leading-5">Latest year</span>
                      <Input
                        type="number"
                        placeholder="eg: 2025"
                        value={latestYear}
                        onChange={onLatestYearChange}
                        containerClasses="bg-white border border-border-normal rounded-sm"
                        inputClasses="w-full py-2.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onApply}
                    disabled={dateRangesEqual(currentDateRange, appliedDateRange) || hasInvalidCustomInput}
                    className="px-3 py-1 text-sm text-text-inverse font-medium leading-5 bg-bg-brand disabled:bg-text-disabled rounded-full"
                  >
                    Apply
                  </button>
                </BaseAccordion.Panel>
              </BaseAccordion.Item>
            </BaseAccordion.Root>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
};
