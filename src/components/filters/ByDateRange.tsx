import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { currentYear } from "../../constants/timedate";
import DateRangeInput from "./DateRangeInput";
import DateRangeOption from "./DateRangeOption";
import Error from "../blocks/Error";
import { QUERY_PARAMS } from "@constants/queryParams";

interface ByDateRangeProps {
  title: string;
  type: string;
  handleChange(values: number[]): void;
  defaultValues: number[];
  min: number;
  max: number;
  clear: boolean;
}

const ByDateRange = ({ title, handleChange, defaultValues, min, max, clear }: ByDateRangeProps) => {
  const router = useRouter();
  const [startYear, endYear] = defaultValues;
  const [showDateInput, setShowDateInput] = useState(false);
  const [startInput, setStartInput] = useState(startYear);
  const [endInput, setEndInput] = useState(endYear);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!clear) setShowDateInput(false);
  }, [clear]);

  // Ensure the custom inputs stay in sync with the search criteria
  useEffect(() => {
    setStartInput(startYear);
    setEndInput(endYear);
  }, [startYear, endYear]);

  // Listen to the qury string to determine if the custom inputs should be shown
  useEffect(() => {
    const start = Number(router.query[QUERY_PARAMS.year_range]?.[0]);
    const end = Number(router.query[QUERY_PARAMS.year_range]?.[1]);
    if (start && end) {
      const range = end - start;
      if (range !== 1 && range !== 5) {
        setShowDateInput(true);
      }
    }
  }, [router.query]);

  const isChecked = (range?: number): boolean => {
    if (range) {
      return Number(endYear) === currentYear() && Number(startYear) === endYear - range;
    }

    return showDateInput;
  };

  const setDateInputVisible = () => {
    setError("");
    setShowDateInput(true);
    handleChange([startYear, endYear]);
  };

  // Fixed selectors
  const selectRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setShowDateInput(false);
    const thisYear = currentYear();
    const calculatedStart = thisYear - Number(e.target.value);
    handleChange([calculatedStart, thisYear]);
  };

  // Custom date selectors
  const submitCustomRange = (updatedDate: number, name: string) => {
    // Validate
    setError("");
    if (typeof updatedDate !== "number") {
      setError("Please enter a valid year");
      return;
    }
    if (name === "From") {
      if (updatedDate > endInput) {
        setError("Please enter a year on or before " + endInput);
        return;
      }
      if (updatedDate < min) {
        setError("Please enter a year on or after " + min);
        return;
      }
      handleChange([updatedDate, Number(endInput)]);
    } else {
      if (updatedDate > max) {
        setError("Please enter a year on or before " + max);
        return;
      }
      if (updatedDate < startInput) {
        setError("Please enter a year on or after " + startInput);
        return;
      }
      handleChange([Number(startInput), updatedDate]);
    }
  };

  return (
    <div>
      <div>{title}</div>
      <div className="mt-2 flex flex-col gap-2">
        <DateRangeOption id="last1" label="in last year" name="date_range" value="1" onChange={selectRange} checked={isChecked(1)} />
        <DateRangeOption id="last5" label="in last 5 years" name="date_range" value="5" onChange={selectRange} checked={isChecked(5)} />
        <DateRangeOption id="specify" label="specify range" name="date_range" value="specify" onChange={setDateInputVisible} checked={isChecked()} />
      </div>
      {showDateInput && (
        <>
          <div className="block lg:grid lg:grid-cols-2 gap-2 mt-2">
            <DateRangeInput
              label="Earliest year"
              name="From"
              value={startInput}
              min={min}
              max={endYear}
              handleSubmit={submitCustomRange}
              handleChange={setStartInput}
            />
            <DateRangeInput
              label="Latest year"
              name="To"
              value={endInput}
              min={startYear}
              max={max}
              handleSubmit={submitCustomRange}
              handleChange={setEndInput}
            />
          </div>
          {error && (
            <div className="text-center">
              <Error message={error} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ByDateRange;
