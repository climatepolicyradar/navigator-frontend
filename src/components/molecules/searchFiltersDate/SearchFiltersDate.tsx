import { Radio, RadioGroup } from "@base-ui/react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/atoms/input/Input";
import { TFiltersGroup } from "@/types";

const RADIO_OPTIONS: { label: string; value: number }[] = [
  { label: "All time", value: 0 },
  { label: "Last year", value: 1 },
  { label: "Last 5 years", value: 5 },
];

interface IProps {
  filterGroup: TFiltersGroup;
}

export const SearchFiltersDate = ({ filterGroup }: IProps) => {
  const [radioValue, setRadioValue] = useState<number | null>(RADIO_OPTIONS[0].value);
  const [earliestYear, setEarliestYear] = useState("");
  const [latestYear, setLatestYear] = useState("");

  const onRadioValueChange = (value: number) => {
    setRadioValue(value);
  };

  const onEarliestYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEarliestYear(event.target.value);
    setRadioValue(null);
  };

  const onLatestYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLatestYear(event.target.value);
    setRadioValue(null);
  };

  const onApply = () => {
    if (radioValue === RADIO_OPTIONS[0].value) {
      console.log(null);
      return;
    }

    if (radioValue !== null) {
      const currentYear = new Date().getFullYear();
      console.log([currentYear - radioValue, currentYear]);
      return;
    }

    console.log([Number(earliestYear), Number(latestYear)]);
  };

  if (filterGroup.container !== "datepicker") return null;

  return (
    <BasePopover.Root>
      <BasePopover.Trigger className="flex gap-2 items-center px-3 py-2 bg-bg-primary data-popup-open:bg-bg-flat text-sm text-text-primary font-medium leading-5 border border-border-normal rounded-full">
        <span>{filterGroup.title}</span>
        <ChevronDown size={16} className="text-elem-icon" />
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner positionMethod="fixed" side="bottom" sideOffset={8} align="start" className="">
          <BasePopover.Popup className="w-95 max-h-[50dvh] px-6 py-5 bg-bg-primary border border-border-normal rounded-xl shadow-2xl overflow-y-auto">
            {/* Date range */}
            <span className="block text-sm text-text-primary font-medium leading-5">Date range</span>
            <RadioGroup value={radioValue} onValueChange={onRadioValueChange} className="pt-2 pb-6 flex flex-col gap-2">
              {RADIO_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-sm text-text-primary font-normal leading-5 cursor-pointer">
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

            {/* Custom */}
            <span className="block text-sm text-text-primary font-medium leading-5">Custom</span>
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
              className="px-3 py-1 text-sm text-text-inverse font-medium leading-5 bg-bg-brand disabled:bg-text-disabled rounded-full"
            >
              Apply
            </button>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
};
