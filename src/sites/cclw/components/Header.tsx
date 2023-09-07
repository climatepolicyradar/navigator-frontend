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
  const showSearch = !NON_SEARCH_PAGES.includes(router.pathname);

  return (
    <header data-cy="header" className={`${background ? "bg-cclw-dark" : ""} w-full pt-2 lg:pt-0`}>
      <div className="container">
        <div className="flex flex-nowrap lg:my-2">
          <div className="items-end flex flex-nowrap flex-1">
            <ExternalLink className="flex" url="https://www.lse.ac.uk/">
              <span className="flex" data-cy="lse-logo">
                <Image src="/images/partners/lse-logo.png" alt="LSE logo" width={34} height={35} className="hidden md:block" />
                <Image src="/images/partners/lse-logo.png" alt="LSE logo" width={23} height={24} className="md:hidden" />
              </span>
            </ExternalLink>
            <ExternalLink className="flex" url="https://www.lse.ac.uk/granthaminstitute/">
              <span className="flex" data-cy="gri-logo">
                <Image src="/images/cclw/partners/gri-3-line-logo.png" alt="GRI logo" width={203} height={35} className="hidden md:block" />
                <Image src="/images/cclw/partners/gri-3-line-logo.png" alt="GRI logo" width={139} height={24} className="md:hidden" />
              </span>
            </ExternalLink>
            {showSearch && (
              <div className="hidden ml-2 md:block md:w-[260px] lg:w-[340px]">
                <FloatingSearch />
              </div>
            )}
          </div>
          <div className="flex text-sm items-end justify-end">
            <ExternalLink className="flex text-white hover:text-white hover:no-underline" url="https://www.climatepolicyradar.org">
              <div data-cy="cpr-logo" className="flex flex-col">
                <span className="text-[10px] leading-none md:text-[11px]">Powered by</span>
                <Image width={157} height={24} alt="Climate Policy Radar logo" src="/images/cpr-logo-horizontal.png" className="hidden md:block" />
                <Image width={131} height={20} alt="Climate Policy Radar logo" src="/images/cpr-logo-horizontal.png" className="md:hidden" />
              </div>
            </ExternalLink>
            <Menu />
          </div>
        </div>
        <div className="text-white text-center my-2">
          <div className="cclw-font font-bold text-xl md:text-2xl">
            <LinkWithQuery href={`/`} className="text-white hover:no-underline hover:text-white" cypress="cclw-logo">
              Climate Change Laws of the World
            </LinkWithQuery>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
