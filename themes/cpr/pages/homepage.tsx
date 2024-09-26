import { MouseEvent } from "react";
import dynamic from "next/dynamic";

import Layout from "@components/layouts/LandingPage";
import { FullWidth } from "@components/panels/FullWidth";
import { SiteWidth } from "@components/panels/SiteWidth";

import AlphaLogo from "@components/logo/AlphaLogo";
import ExactMatch from "@components/filters/ExactMatch";
import Header from "@components/headers/LandingPage";
import Banner from "@components/banner/FullHeight";
import Footer from "@components/footer/Footer";

import LandingPageLinks from "@cpr/components/LandingPageLinks";
import Partners from "@cpr/components/Partners";
import Summary from "@cpr/components/Summary";
import LandingSearchForm from "@cpr/components/LandingSearchForm";

const WorldMap = dynamic(() => import("@components/map/WorldMap"), {
  loading: () => <p>Loading world map...</p>,
  ssr: false,
});

type TProps = {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  handleSearchChange: (type: string, value: any) => void;
  searchInput: string;
  exactMatch: boolean;
};

const LandingPage = ({ handleSearchInput, handleSearchChange, searchInput, exactMatch }: TProps) => {
  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const term = e.currentTarget.textContent;
    handleSearchInput(term);
  };

  return (
    <Layout title="Law and Policy Search">
      <div className="relative">
        <Header />
        <main className="relative h-full">
          <Banner />
          <section className="absolute inset-0 z-10 flex flex-col items-center justify-center min-h-[800px]">
            <AlphaLogo />
            <SiteWidth extraClasses="mt-24 md:mt-48 max-w-screen-lg mx-auto">
              <LandingSearchForm handleSearchInput={handleSearchInput} input={searchInput} />
              <div className="mt-4 flex justify-end">
                <ExactMatch landing={true} checked={exactMatch} id="exact-match" handleSearchChange={handleSearchChange} />
              </div>
              <div className="mt-12">
                <LandingPageLinks handleLinkClick={handleLinkClick} />
              </div>
            </SiteWidth>
          </section>
        </main>
        <FullWidth extraClasses="hidden my-6 md:block">
          <WorldMap />
        </FullWidth>
        <Summary />
        <Partners />
        <Footer />
      </div>
    </Layout>
  );
};

export default LandingPage;
