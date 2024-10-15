import { useRouter } from "next/router";

import Pill from "@components/Pill";

import { QUERY_PARAMS } from "@constants/queryParams";
import { ParsedUrlQuery } from "querystring";

type TFilterChange = (type: string, value: string) => void;

type TProps = {
  filterChange: TFilterChange;
};

// loop over the keys in QUERY_PARAMS and check if they are in the query string, if they are, display them as pills
// if the key is not in the query string, don't display it
const generatePills = (queryParams: ParsedUrlQuery, filterChange: TFilterChange) => {
  let pills: JSX.Element[] = [];

  Object.keys(QUERY_PARAMS).map((key) => {
    const value = queryParams[QUERY_PARAMS[key]];
    if (value) {
      if (Array.isArray(value)) {
        return value.map((v: string) =>
          pills.push(
            <Pill key={v} onClick={() => filterChange(QUERY_PARAMS[key], v)}>
              {v}
            </Pill>
          )
        );
      }
      return pills.push(
        <Pill key={value} onClick={() => filterChange(QUERY_PARAMS[key], value)}>
          {value}
        </Pill>
      );
    } else {
      return;
    }
  });

  return pills;
};

export const AppliedFilters = ({ filterChange }: TProps) => {
  const router = useRouter();

  return <>{generatePills(router.query, filterChange).map((pill) => pill)}</>;
};
