import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { DateRangeInput } from "./DateRangeInput";
import { FormError } from "../forms/FormError";
import { InputListContainer } from "@components/filters/InputListContainer";
import { InputRadio } from "@components/forms/Radio";

import { QUERY_PARAMS } from "@constants/queryParams";
import { currentYear } from "../../constants/timedate";

interface ByDateRangeProps {
  type: string;
  handleChange(values: number[], reset?: boolean): void;
  defaultValues: number[];
  min: number;
  max: number;
}

export const DateRange = ({ handleChange, defaultValues, min, max }: ByDateRangeProps) => {
  const router = useRouter();
  const [startYear, endYear] = defaultValues;
  const [showDateInput, setShowDateInput] = useState(false);
  const [startInput, setStartInput] = useState(startYear);
  const [endInput, setEndInput] = useState(endYear);
  const [error, setError] = useState("");

  // Ensure the custom inputs stay in sync with the search criteria
  useEffect(() => {
    setStartInput(startYear);
    setEndInput(endYear);
  }, [startYear, endYear]);

  // Display the custom inputs if the range is not 1 or 5 years
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
      if (showDateInput) return false;
      return Number(endYear) === currentYear() && Number(startYear) === endYear - range;
    }

    return showDateInput;
  };

  const setDateInputVisible = () => {
    setError("");
    setShowDateInput(true);
    handleChange([startYear, endYear]);
  };

  const handleDateSelect = (range: number, reset = false) => {
    setError("");
    setShowDateInput(false);
    const thisYear = currentYear();
    const calculatedStart = thisYear - range;
    handleChange([calculatedStart, thisYear], reset);
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
    <InputListContainer>
      <InputRadio label="All time" onChange={() => handleDateSelect(0, true)} checked={isChecked(max - min)} />
      <InputRadio label="In last year" onChange={() => handleDateSelect(1)} checked={isChecked(1)} />
      <InputRadio label="In last 5 years" onChange={() => handleDateSelect(5)} checked={isChecked(5)} />
      <InputRadio label="Specify range" onChange={setDateInputVisible} checked={isChecked()} />

      {showDateInput && (
        <>
          <div className="block lg:grid lg:grid-cols-2 gap-2">
            <DateRangeInput label="Earliest year" name="From" value={startInput} handleSubmit={submitCustomRange} handleChange={setStartInput} />
            <DateRangeInput label="Latest year" name="To" value={endInput} handleSubmit={submitCustomRange} handleChange={setEndInput} />
          </div>
          {error && <FormError message={error} />}
        </>
      )}
    </InputListContainer>
  );
};
