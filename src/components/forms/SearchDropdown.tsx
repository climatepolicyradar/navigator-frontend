import { useRouter } from "next/router";
import useConfig from "@hooks/useConfig";
import { SearchIcon } from "@components/svg/Icons";
import { QUERY_PARAMS } from "@constants/queryParams";
import { TGeography } from "@types";
import { systemGeoCodes } from "@constants/systemGeos";

type TProps = {
  show: boolean;
  term: string;
  handleSearchClick: (term: string, filter?: string, filterValue?: string) => void;
  largeSpacing?: boolean;
};

export const SearchDropdown = ({ show = false, term, handleSearchClick, largeSpacing }: TProps) => {
  const router = useRouter();
  const configQuery = useConfig();
  const geographies = configQuery.data?.countries || [];

  const geographiesFiltered = geographies.filter(
    (geography) =>
      !systemGeoCodes.includes(geography.slug) &&
      (geography.display_value.toLowerCase().includes(term.toLocaleLowerCase()) ||
        term.toLocaleLowerCase().includes(geography.display_value.toLowerCase())) &&
      term.toLocaleLowerCase().search(new RegExp("\\b" + geography.display_value.toLowerCase() + "\\b", "i")) >= 0
  );

  const termWithoutGeography = (geography: string) => term.toLowerCase().replace(geography.toLowerCase(), "").trim();

  function selectProps(...props) {
    return function (obj) {
      const newObj = {};
      props.forEach((name) => {
        newObj[name] = obj[name];
      });

      return newObj;
    };
  }

  const termWithoutGeographies = (geographies: TGeography[]) => {
    let intendedGeographies = geographies.map((geography) => geography.display_value.toLowerCase());
    console.log(intendedGeographies);
    // intendedGeographies = geographies.map(selectProps("display_value"));
    // console.log(intendedGeographies);
    for (let index = 0; index < geographies.length; index++) {
      term = term.toLowerCase().replace(geographies[index].display_value.toLowerCase(), "").trim();
    }
    console.log(term);
    return term.trim();
  };

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
    `flex flex-wrap items-center cursor-pointer py-2 px-4 block text-cpr-dark hover:bg-gray-200 focus:bg-gray-200 ${last ? "rounded-b-lg" : ""}`;

  const renderSearchSuggestion = (geographies: TGeography[]) => {
    if (!geographies || geographies === null || geographies.length === 0) return;

    // When multiple geography matches are found e.g., Sudan and South Sudan, select the geography with the longest
    // display name.
    let geography;
    // if (geographies.length > 1) {
    //   // geography = geographies.reduce(function (prev, current) {
    //   //   return prev && prev.display_value.length > current.display_value.length ? prev : current;
    //   // });
    //   // geography = Object.keys(geography).length === 1 ? geography[0] : geography;
    //   geography = geographies;
    // } else geography = geographies[0];

    geography = geographies.length === 1 ? geographies[0] : geographies;
    const intendedGeography = geography;
    if (Object.keys(intendedGeography).length === 0) return;

    console.log(Object.keys(intendedGeography).length);
    // if (Object.keys(intendedGeography).length === 1) {
    //   if (!term.toLowerCase().includes(intendedGeography.display_value.toLowerCase())) return;
    //   if (!termWithoutGeography(intendedGeography.display_value).trim().length) return;
    // }

    return (
      <ul>
        {intendedGeography.length > 1 && (
          <>
            <li key={"intendedGeography.slug"}>
              <p>
                {intendedGeography.map((geography, index) => {
                  const last = index + 1 === intendedGeography.length;
                  return (
                    <a href="#" className={anchorClasses(false)} onClick={(e) => handleSuggestionClick(e, intendedGeography[index])}>
                      Did you mean to search for&nbsp;
                      <span className="font-bold text-black">{termWithoutGeographies(intendedGeography[index])}</span>&nbsp;in&nbsp;
                      <span className="font-bold text-black">{geography.display_value}</span>?
                    </a>
                  );
                })}
              </p>
              <a href="#" className={anchorClasses(false)} onClick={(e) => handleSuggestionClick(e, intendedGeography)}>
                Did you mean to search for&nbsp;
                <span className="font-bold text-black">{termWithoutGeographies(intendedGeography)}</span>&nbsp;in&nbsp;
                <span className="font-bold text-black">{intendedGeography.display_value}</span>&nbsp;and&nbsp;
                <span className="font-bold text-black">{intendedGeography.display_value}</span>?
              </a>
            </li>
          </>
        )}

        {/* {intendedGeography.length === 1}
        <li key={intendedGeography.slug}>
          <a href="#" className={anchorClasses(false)} onClick={(e) => handleSuggestionClick(e, intendedGeography)}>
            Did you mean to search for&nbsp;
            <span className="font-bold text-black">{termWithoutGeography(intendedGeography.display_value)}</span>&nbsp;in&nbsp;
            <span className="font-bold text-black">{intendedGeography.display_value}</span>?
          </a>
        </li> */}
      </ul>
    );
  };

  return (
    <div
      className={`absolute bg-gray-50 text-cpr-dark border-t-transparent border border-gray-200 w-full rounded-b-lg max-h-[300px] overflow-y-auto search-dropdown z-10 shadow-lg ${
        largeSpacing ? "search-dropdown_large" : ""
      }`}
    >
      <a href="#" className={anchorClasses(!geographiesFiltered.length)} onClick={handleClick}>
        <span className="mr-2 w-[20px]">
          <SearchIcon />
        </span>
        Search <span className="font-bold text-black mx-1">{term}</span> in all documents
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
                    <span className="font-bold text-black">{geography.display_value}</span> <span className="text-sm ml-4">Geography profile</span>
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
