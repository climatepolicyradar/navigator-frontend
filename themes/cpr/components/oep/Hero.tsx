import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { SingleCol } from "@components/panels/SingleCol";
import { SiteWidth } from "@components/panels/SiteWidth";

import { QUERY_PARAMS } from "@constants/queryParams";

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <g opacity="0.6">
      <path
        d="M17.5 17.5L13.9167 13.9167M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
        stroke="#202020"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
);

export const Hero = () => {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    router.push({ pathname: "/search", query: { [QUERY_PARAMS.query_string]: term, [QUERY_PARAMS.category]: "Reports" } });
  };

  return (
    <section>
      <div className="h-[800px] relative z-1 overflow-hidden">
        <div className="oep-hero-left oep-hero-background"></div>
        <div className="oep-hero-bg oep-hero-background"></div>
        <div className="oep-hero-right oep-hero-background"></div>
        <SiteWidth>
          <SingleCol>
            <div className="relative z-10 pt-[218px] pb-[100px]">
              <div className="mb-6">
                <Image src="/images/oep/oep-logo-small.png" width={155} height={54} alt="Ocean Energy Pathway logo" data-cy="oep-logo" />
              </div>
              <h1 className="font-['tenez'] font-bold italic text-oep-royal-blue text-8xl tracking-[-0.96px] leading-[0.8]">
                <span className="not-italic">POWER</span> library
              </h1>
              <p className="my-9 text-2xl text-textDark">Helping the offshore wind sector design effective strategies</p>
              <div className="relative">
                <button className="h-full absolute left-0 px-4" onClick={() => handleSubmit()} aria-label="Search">
                  <span className="block">
                    <SearchIcon />
                  </span>
                </button>
                <input
                  id="oep-searchInput"
                  data-analytics="oep-searchInput"
                  data-cy="search-input"
                  type="search"
                  className="w-full text-textDark py-5 pl-[52px] text-normal bg-white rounded-xl shadow-oep focus:border-white focus:ring-0 placeholder:text-textNormal"
                  value={term}
                  onChange={(e) => setTerm(e.currentTarget.value)}
                  onKeyDown={handleKeydown}
                  placeholder="Search..."
                  aria-label="Search"
                />
              </div>
            </div>
          </SingleCol>
        </SiteWidth>
      </div>
    </section>
  );
};
