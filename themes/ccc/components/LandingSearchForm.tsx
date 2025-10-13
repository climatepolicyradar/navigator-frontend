import { Search } from "lucide-react";
import router from "next/router";
import { useState, useEffect, useRef, ChangeEvent } from "react";

import { Button } from "@/components/atoms/button/Button";
import { SearchDropdown } from "@/components/forms/SearchDropdown";
import { QUERY_PARAMS } from "@/constants/queryParams";

const EXAMPLE_SEARCHES = [
  {
    id: 1,
    label: "Brazil + Paris Agreement",
    params: {
      [QUERY_PARAMS.concept_preferred_label]: ["principal_law/Brazil", "principal_law/Paris Agreement"],
    },
  },
  {
    id: 2,
    label: "United States + United States Fifth Circuit (5th Cir.)",
    params: {
      [QUERY_PARAMS.concept_preferred_label]: ["jurisdiction/United States", "jurisdiction/United States Fifth Circuit (5th Cir.)"],
    },
  },
  {
    id: 3,
    label: "Germany + Suits against governments",
    params: {
      [QUERY_PARAMS.country]: "Germany",
      [QUERY_PARAMS.concept_preferred_label]: "category/Suits against governments",
    },
  },
];

interface IProps {
  placeholder?: string;
  handleSearchInput(term: string, filter?: string, filterValue?: string): void;
  input?: string;
}

const LandingSearchForm = ({ placeholder, input, handleSearchInput }: IProps) => {
  const [term, setTerm] = useState("");
  const [formFocus, setFormFocus] = useState(false);
  const formRef = useRef(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.currentTarget.value);
  };

  useEffect(() => {
    if (input) setTerm(input);
  }, [input]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        return setFormFocus(false);
      }
      setFormFocus(true);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef]);

  const displayPlaceholder = placeholder ?? "Search the full text of cases";

  const handleQuickSearch = (params: Record<string, string | string[]>) => {
    // Push directly to search page with all parameters
    router.push({
      pathname: "/search",
      query: {
        ...params,
      },
    });
  };

  return (
    <>
      <form data-cy="search-form" ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <div className="max-w-screen-md flex items-stretch relative">
          <button className="absolute left-0 h-full px-4 text-text-primary" onClick={() => handleSearchInput(term)} aria-label="Search">
            <span className="block">
              <Search height="16" width="16" />
            </span>
          </button>
          <input
            id="landingPage-searchInput-ccc"
            data-analytics="landingPage-searchInput"
            data-cy="search-input"
            type="search"
            className="text-base py-3 h-[48px] pl-12 pr-3 w-full rounded-lg border-0 placeholder:text-text-tertiary bg-surface-heavy text-text-primary"
            value={term}
            onChange={onChange}
            placeholder={displayPlaceholder}
            aria-label="Search the full text of cases"
          />
          <SearchDropdown term={term} show={formFocus} handleSearchClick={handleSearchInput} largeSpacing />
        </div>
      </form>
      <div className="hidden mt-4 md:flex flex-wrap items-center gap-2 justify-center">
        <span className="text-mcf-blue">Suggestions:</span>
        {EXAMPLE_SEARCHES.map((example) => (
          <Button
            key={example.id}
            rounded
            size="small"
            variant="ghost"
            className="hover:!bg-gray-100 !text-gray-500 underline"
            onClick={() => handleQuickSearch(example.params)}
            data-cy={`example-search-${example.id}`}
          >
            {example.label}
          </Button>
        ))}
      </div>
    </>
  );
};
export default LandingSearchForm;
