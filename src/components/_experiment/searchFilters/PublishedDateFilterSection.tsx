import { useState } from "react";

import {
  DATE_RANGE_MIN_YEAR,
  parseYearRange,
  resolveYearRangeForPreset,
  serialiseYearRange,
  TDateRangePreset,
} from "@/utils/_experiment/dateRangeFilters";

type TProps = {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
};

const DATE_RANGE_PRESETS: Array<{ value: TDateRangePreset; label: string }> = [
  { value: "all_time", label: "All time" },
  { value: "last_year", label: "Last year" },
  { value: "last_5_years", label: "Last 5 years" },
];

/** Preset and custom year-range UI for published-date filtering in shadow search. */
export function PublishedDateFilterSection({ value, onChange }: TProps) {
  const currentYear = new Date().getFullYear();
  const selectedDateRange = parseYearRange(value ?? "") ?? resolveYearRangeForPreset("all_time", currentYear);
  const [startYearInput, setStartYearInput] = useState(String(selectedDateRange.startYear));
  const [endYearInput, setEndYearInput] = useState(String(selectedDateRange.endYear));

  const isLastYear = selectedDateRange.startYear === currentYear - 1 && selectedDateRange.endYear === currentYear;
  const isLastFiveYears = selectedDateRange.startYear === currentYear - 5 && selectedDateRange.endYear === currentYear;
  const isAllTime = selectedDateRange.startYear <= DATE_RANGE_MIN_YEAR && selectedDateRange.endYear === currentYear;
  const selectedPreset: TDateRangePreset = isAllTime ? "all_time" : isLastYear ? "last_year" : isLastFiveYears ? "last_5_years" : "custom";

  const applyDateRangeSelection = (startYear: number, endYear: number, clearToAllTime = false) => {
    setStartYearInput(String(startYear));
    setEndYearInput(String(endYear));
    if (clearToAllTime) {
      onChange(null);
      return;
    }
    onChange(serialiseYearRange(startYear, endYear));
  };

  const applyPresetDateRange = (preset: TDateRangePreset) => {
    const presetRange = resolveYearRangeForPreset(preset, currentYear);
    applyDateRangeSelection(presetRange.startYear, presetRange.endYear, preset === "all_time");
  };

  const applyCustomDateRange = () => {
    const startYearForFilter = startYearInput.trim() ? Number(startYearInput) : DATE_RANGE_MIN_YEAR;
    const endYearForFilter = endYearInput.trim() ? Number(endYearInput) : currentYear;
    if (!Number.isInteger(startYearForFilter) || !Number.isInteger(endYearForFilter)) return;
    if (startYearForFilter > endYearForFilter) return;
    if (startYearForFilter < DATE_RANGE_MIN_YEAR || endYearForFilter > currentYear) return;
    applyDateRangeSelection(startYearForFilter, endYearForFilter);
  };

  return (
    <div className="flex flex-col gap-2 text-inky-black">
      <div className="border-b border-transparent-regular pb-2">
        <h4 className="text-sm text-inky-black font-medium">Date range</h4>
      </div>
      {DATE_RANGE_PRESETS.map((preset) => (
        <label key={preset.value} className="inline-flex items-center gap-2 rounded-sm px-1 py-0.5 text-sm text-inky-black hover:bg-neutral-100">
          <input
            type="radio"
            checked={selectedPreset === preset.value}
            onChange={() => applyPresetDateRange(preset.value)}
            className="h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-full border border-gray-300 bg-white checked:border-4 checked:border-inky-black"
          />
          <span>{preset.label}</span>
        </label>
      ))}
      <div className="pt-2 border-b border-transparent-regular pb-2">
        <h4 className="text-sm text-inky-black">Custom</h4>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-inky-black">Earliest year</label>
          <input
            type="number"
            min={DATE_RANGE_MIN_YEAR}
            max={currentYear}
            value={startYearInput}
            onChange={(event) => setStartYearInput(event.target.value)}
            onBlur={applyCustomDateRange}
            className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-inky-black"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-inky-black">Latest year</label>
          <input
            type="number"
            min={DATE_RANGE_MIN_YEAR}
            max={currentYear}
            value={endYearInput}
            onChange={(event) => setEndYearInput(event.target.value)}
            onBlur={applyCustomDateRange}
            className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-inky-black"
          />
        </div>
      </div>
    </div>
  );
}
