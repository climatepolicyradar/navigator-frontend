import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/atoms/button/Button";
import { InputListContainer } from "@/components/filters/InputListContainer";
import { InputRadio } from "@/components/forms/Radio";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { currentYear } from "@/constants/timedate";

import { DateRangeInput } from "./DateRangeInput";
import { FormError } from "../forms/FormError";

interface IProps {
  type: string;
  handleChange(values: string[], reset?: boolean): void;
  defaultValues: string[];
  min: number;
  max: number;
}

export const DateRange = ({ handleChange, defaultValues, min, max }: IProps) => {
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

  useEffect(() => {
    setError("");
  }, [startInput, endInput]);

  const isChecked = (range?: number): boolean => {
    if (range) {
      if (showDateInput) return false;
      return Number(endYear) === currentYear() && Number(startYear) === Number(endYear) - range;
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
    handleChange([calculatedStart.toString(), thisYear.toString()], reset);
  };

  // Custom date selectors
  const submitCustomRange = () => {
    const startInputInt = Number(startInput);
    const endInputInt = Number(endInput);
    // Validate
    setError("");
    if (isNaN(startInputInt) || isNaN(endInputInt)) {
      setError("Please enter a valid year");
      return;
    }
    if (startInputInt > endInputInt) {
      setError("Please enter a start date before the end date");
      return;
    }
    if (startInputInt < min) {
      setError("Please enter a year on or after " + min);
      return;
    }
    if (endInputInt > max) {
      setError("Please enter a year on or before " + max);
      return;
    }
    handleChange([startInput, endInput]);
  };

  return (
    <InputListContainer>
      <InputRadio label="All time" onChange={() => handleDateSelect(0, true)} checked={isChecked(max - min)} name="all-time" />
      <InputRadio label="In last year" onChange={() => handleDateSelect(1)} checked={isChecked(1)} name="in-last-year" />
      <InputRadio label="In last 5 years" onChange={() => handleDateSelect(5)} checked={isChecked(5)} name="in-last-five-years" />
      <InputRadio label="Specify range" onChange={setDateInputVisible} checked={isChecked()} name="specify-custom-range" />

      {showDateInput && (
        <>
          <div className="block lg:grid lg:grid-cols-2 gap-2">
            <DateRangeInput label="Earliest year" name="From" value={startInput} handleSubmit={submitCustomRange} handleChange={setStartInput} />
            <DateRangeInput label="Latest year" name="To" value={endInput} handleSubmit={submitCustomRange} handleChange={setEndInput} />
          </div>
          {error && <FormError message={error} />}
          {!error && (defaultValues[0] !== startInput || defaultValues[1] !== endInput) && (
            <div>
              <Button rounded onClick={submitCustomRange}>
                Apply
              </Button>
            </div>
          )}
        </>
      )}
    </InputListContainer>
  );
};
