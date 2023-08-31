import { useRouter } from "next/router";
import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { FloatingSearch } from "@components/FloatingSearch";
import { Menu } from "@cclw/components/Menu";
import Image from "next/image";

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
              <div className="flex" data-cy="lse-logo">
                <Image src="/images/partners/lse-logo.png" alt="LSE logo" width={34} height={35} />
              </div>
            </ExternalLink>
            <ExternalLink className="flex" url="https://www.lse.ac.uk/granthaminstitute/">
              <div className="flex" data-cy="gri-logo">
                <Image src="/images/cclw/partners/gri-3-line-logo.png" alt="GRI logo" width={203} height={35} />
              </div>
            </ExternalLink>
            {showSearch() && (
              <div className="hidden ml-2 md:block md:w-[220px] lg:[280px]">
                <FloatingSearch />
              </div>
            )}
          </div>
          <div className="flex justify-self-end text-sm flex-grow-0 items-end">
            <ExternalLink className="flex text-white hover:text-white hover:no-underline" url="https://www.climatepolicyradar.org">
              <div data-cy="cpr-logo" className="flex flex-col">
                <span className="text-[11px] leading-none">Powered by</span>
                <Image width={157} height={24} alt="Climate Policy Radar logo" src="/images/cpr-logo-horizontal.png" />
              </div>
            </ExternalLink>
            <Menu />
          </div>
          <div className="col-span-2 flex-1 flex justify-center text-white order-last items-end basis-full text-center my-6 lg:my-0 lg:mt-6">
            <div className="cclw-font font-bold text-xl md:text-2xl">
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
