import { useRouter } from "next/router";

import { Icon } from "@/components/atoms/icon/Icon";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { SYSTEM_GEO_CODES } from "@/constants/systemGeos";
import useConfig from "@/hooks/useConfig";
import { TGeography } from "@/types";

interface IProps {
  show: boolean;
  term: string;
  handleSearchClick: (term: string, filter?: string, filterValue?: string) => void;
  largeSpacing?: boolean;
}

export const SearchDropdown = ({ show = false, term, handleSearchClick, largeSpacing }: IProps) => {
  const router = useRouter();
  const configQuery = useConfig();
  const geographies = configQuery.data?.countries || [];

  const geographiesFiltered = geographies.filter(
    (geography) =>
      !SYSTEM_GEO_CODES.includes(geography.slug) &&
      (geography.display_value.toLowerCase().includes(term.toLocaleLowerCase()) ||
        term.toLocaleLowerCase().includes(geography.display_value.toLowerCase()))
  );

  const termWithoutGeography = (geography: string) => term.toLowerCase().replace(geography.toLowerCase(), "").trim();

  if (!term || !show) return null;

  const handleClick = (e: any) => {
    e.preventDefault();
    handleSearchClick(term);
  };

  const handleCountryClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    router.push({ pathname: url, query: router.query });
  };

  const handleSuggestionClick = (e: React.MouseEvent<HTMLAnchorElement>, geography: TGeography) => {
    e.preventDefault();
    handleSearchClick(termWithoutGeography(geography.display_value), QUERY_PARAMS.country, geography.slug);
  };

  const anchorClasses = (last: boolean) =>
    `flex flex-wrap items-center cursor-pointer py-2 px-4 block text-cpr-dark hover:no-underline hover:bg-gray-200 focus:bg-gray-200 ${
      last ? "rounded-b-lg" : ""
    }`;

  const renderSearchSuggestion = (geographies: TGeography[]) => {
    if (!geographies || geographies === null || geographies.length === 0) return;

    // When multiple geography matches are found e.g., Sudan and South Sudan, select the geography with the longest
    // display name.
    let geography: TGeography;
    if (geographies.length > 1) {
      geography = geographies.reduce(function (prev, current) {
        return prev && prev.display_value.length > current.display_value.length ? prev : current;
      });
    } else geography = geographies[0];

    const intendedGeography = geography;
    if (Object.keys(intendedGeography).length === 0) return;

    if (!term.toLowerCase().includes(intendedGeography.display_value.toLowerCase())) return;
    if (!termWithoutGeography(intendedGeography.display_value).trim().length) return;

    return (
      <ul>
        <li key={intendedGeography.slug}>
          <a href="#" className={anchorClasses(false)} onClick={(e) => handleSuggestionClick(e, intendedGeography)}>
            Did you mean to search for&nbsp;
            <span className="font-medium text-black">{termWithoutGeography(intendedGeography.display_value)}</span>
            &nbsp;in&nbsp;
            <span className="font-medium text-black">{intendedGeography.display_value}</span>?
          </a>
        </li>
      </ul>
    );
  };

  return (
    <div
      className={`search-dropdown absolute bg-gray-50 text-cpr-dark border-t-transparent border border-gray-300 w-full rounded-b-lg max-h-[300px] overflow-y-auto z-10 shadow-inner ${
        largeSpacing ? "search-dropdown_large" : ""
      }`}
    >
      <a href="#" className={anchorClasses(!geographiesFiltered.length)} onClick={handleClick}>
        <span className="mr-2 w-5">
          <Icon name="search" />
        </span>
        Search <span className="font-medium text-black mx-1">{term}</span> in all documents
      </a>
      {geographiesFiltered.length > 0 && renderSearchSuggestion(geographiesFiltered)}
      {!!geographiesFiltered.length && (
        <>
          <div className="py-2 px-4 text-sm">View countries and territories information</div>
          <ul>
            {geographiesFiltered.map((geography, i) => {
              const last = i + 1 === geographiesFiltered.length;
              return (
                <li key={geography.id}>
                  <a href="#" className={anchorClasses(last)} onClick={(e) => handleCountryClick(e, `/geographies/${geography.slug}`)}>
                    <span className="font-medium text-black">{geography.display_value}</span> <span className="text-sm ml-4">Geography profile</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};
