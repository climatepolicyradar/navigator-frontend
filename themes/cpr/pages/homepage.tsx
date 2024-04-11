import { MouseEvent } from "react";
import { Hero } from "@components/blocks/Hero";
import AlphaLogo from "@components/logo/AlphaLogo";
import ExactMatch from "@components/filters/ExactMatch";
import LandingPageLinks from "@components/blocks/LandingPageLinks";
import Header from "@components/headers/LandingPage";
import Banner from "@components/banner/FullHeight";
import Summary from "@components/blocks/Summary";
import Partners from "@components/blocks/Partners";
import Footer from "@components/footer/Footer";
import Layout from "@components/layouts/LandingPage";
import LandingSearchForm from "@cpr/components/LandingSearchForm";
import { GSTBanner } from "@cpr/components/GSTBanner";
import WorldMap from "@components/map/WorldMap";

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
      <GSTBanner />
      <div className="relative">
        <Header />
        <main className="relative h-full">
          <Banner />
          <Hero>
            <AlphaLogo />
            <div className="container mt-24 md:mt-48 max-w-screen-lg mx-auto">
              <LandingSearchForm handleSearchInput={handleSearchInput} input={searchInput} />
              <div className="mt-4 flex justify-end">
                <ExactMatch landing={true} checked={exactMatch} id="exact-match" handleSearchChange={handleSearchChange} />
              </div>
              <div className="mt-12">
                <LandingPageLinks handleLinkClick={handleLinkClick} />
              </div>
            </div>
          </Hero>
        </main>
        <div className="container hidden my-6 md:block">
          <WorldMap />
        </div>
        <Summary />
        <Partners />
        <Footer />
      </div>
    </Layout>
  );
};

export default LandingPage;
