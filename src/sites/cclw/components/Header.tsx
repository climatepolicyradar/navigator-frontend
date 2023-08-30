/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { FloatingSearch } from "@components/FloatingSearch";
import LogoMono from "@components/svg/LogoMono";
import { Menu } from "./Menu";

const NON_SEARCH_PAGES = ["/", "/search"];

const Header = ({ background = true }) => {
  const router = useRouter();

  // Do not show search on specific pages
  const showSearch = () => {
    return !NON_SEARCH_PAGES.includes(router.pathname);
  };

  return (
    <header data-cy="header" className={`${background ? "bg-cclw-dark" : ""} w-full pt-6 lg:pt-0`}>
      <div className="container">
        <div className="grid grid-cols-2 auto-cols-auto lg:my-6">
          <div className="items-end flex flex-grow-0">
            <ExternalLink className="flex" url="https://www.lse.ac.uk/">
              <div className="h-[40px] w-[40px] flex" data-cy="lse-logo">
                <img src="/images/partners/lse-logo.png" alt="LSE logo" width={40} height={40} />
              </div>
            </ExternalLink>
            <ExternalLink className="flex" url="https://www.lse.ac.uk/granthaminstitute/">
              <div className="h-[40px] w-[180px] flex" data-cy="gri-logo">
                <img src="/images/cclw/partners/gri_white_logo.svg" alt="GRI logo" width={180} height={40} />
              </div>
            </ExternalLink>
          </div>
          <div className="flex justify-self-end text-sm flex-grow-0 items-end">
            <ExternalLink className="flex text-white" url="https://www.climatepolicyradar.org">
              <div data-cy="cpr-logo" className="md:flex">
                <span className="text-xs md:mr-2">Powered by</span>
                <LogoMono fixed />
              </div>
            </ExternalLink>
            {showSearch() && (
              <div className="hidden md:block ml-4 md:w-[220px] lg:[280px]">
                <FloatingSearch />
              </div>
            )}
            <Menu />
          </div>
          <div className="col-span-2 flex-1 flex justify-center text-white order-last items-end basis-full text-center my-6 lg:my-0 lg:mt-6">
            <div className="cclw-font font-bold text-xl md:text-4xl lg:text-3xl xl:text-4xl">
              <LinkWithQuery href={`/`} className="text-white hover:no-underline hover:text-white" cypress="cclw-logo">
                Climate Change Laws of the World
              </LinkWithQuery>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
