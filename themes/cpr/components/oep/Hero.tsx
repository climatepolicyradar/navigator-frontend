import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { SingleCol } from "@components/panels/SingleCol";
import { SiteWidth } from "@components/panels/SiteWidth";
import { ExternalLink } from "@components/ExternalLink";

import { QUERY_PARAMS } from "@constants/queryParams";
import { Icon } from "@components/atoms/icon/Icon";

export const Hero = () => {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSuggestionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleSubmit(e.currentTarget.textContent);
  };

  const handleSubmit = (query?: string) => {
    router.push({ pathname: "/search", query: { [QUERY_PARAMS.query_string]: query ?? term, [QUERY_PARAMS.category]: "reports" } });
  };

  return (
    <section>
      <div className="h-[600px] relative z-1 overflow-hidden md:h-[800px]">
        <div className="oep-hero-left oep-hero-background"></div>
        <div className="oep-hero-bg oep-hero-background"></div>
        <div className="oep-hero-right oep-hero-background"></div>
        <SiteWidth>
          <SingleCol>
            <div className="relative z-10 pb-[100px] pt-[100px] md:pt-[218px]">
              <div className="mb-6 flex">
                <ExternalLink url="https://www.oceanenergypathway.org" className="flex">
                  <Image src="/images/oep/OEP-logo-small.png" width={155} height={54} alt="Ocean Energy Pathway logo" data-cy="oep-logo" />
                </ExternalLink>
              </div>
              <h1 className="font-['tenez'] font-bold italic text-oep-royal-blue tracking-[-0.96px] leading-[80%] text-7xl md:text-8xl">
                <span className="not-italic">POWER</span> Library
              </h1>
              <p className="my-6 text-xl text-textDark md:text-2xl">Helping the offshore wind sector design effective strategies</p>
              <div className="relative z-1 mb-4">
                <button className="h-full absolute left-0 px-4 text-textNormal" onClick={() => handleSubmit()} aria-label="Search">
                  <span className="block">
                    <Icon name="search" height="20" width="20" />
                  </span>
                </button>
                <input
                  id="oep-searchInput"
                  data-analytics="oep-searchInput"
                  data-cy="search-input"
                  type="search"
                  className="w-full text-textDark py-5 pl-[52px] text-normal text-base bg-white rounded-xl shadow-oep border-[#f1f1f1] focus:border-oep-salmon focus:ring-0 placeholder:text-textNormal"
                  value={term}
                  onChange={(e) => setTerm(e.currentTarget.value)}
                  onKeyDown={handleKeydown}
                  placeholder="Search..."
                  aria-label="Search"
                />
              </div>
              <div className="flex gap-4 relative z-2 text-sm">
                <p className="font-medium text-textDark">Suggestions:</p>
                <ul className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <li>
                    <a href="" onClick={handleSuggestionClick} className="text-textDark opacity-60 hover:opacity-100">
                      Offshore wind development
                    </a>
                  </li>
                  <li>
                    <a href="" onClick={handleSuggestionClick} className="text-textDark opacity-60 hover:opacity-100">
                      Floating offshore wind
                    </a>
                  </li>
                  <li>
                    <a href="" onClick={handleSuggestionClick} className="text-textDark opacity-60 hover:opacity-100">
                      Offshore wind communities
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </SingleCol>
        </SiteWidth>
      </div>
    </section>
  );
};
