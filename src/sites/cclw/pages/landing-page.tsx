import React from "react";
import Image from "next/image";
import { ExternalLink } from "@components/ExternalLink";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Hero } from "../components/Hero";
import { Articles } from "../components/Articles";
import { Partners } from "@cclw/components/Partners";

type TProps = {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
};

const LandingPage = ({ handleSearchInput, searchInput }: TProps) => {
  return (
    <>
      <main className="flex flex-col flex-1">
        <div className="gradient-container">
          <Header background={false} />
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} />
        </div>
        <div className="container my-12" data-cy="featured-content">
          <h2 className="text-center mb-6">Featured Content</h2>
          <Articles />
        </div>
        <div className="container my-12" data-cy="powered">
          <div className="md:flex justify-center gap-12 text-center">
            <div className="mb-12 md:mb-0">
              <h2 className="mb-6">Hosted by</h2>
              <div className="flex items-center justify-center gap-6">
                <ExternalLink className="flex" url="https://www.lse.ac.uk/">
                  <span className="flex" data-cy="lse-logo">
                    <Image src="/images/partners/lse-logo.png" alt="London School of Economics logo" width={64} height={64} />
                  </span>
                </ExternalLink>
                <ExternalLink className="flex" url="https://www.lse.ac.uk/granthaminstitute/">
                  <span className="flex" data-cy="gri-logo">
                    <Image src="/images/cclw/partners/gri-logo.png" alt="Grantham Research Institute logo" width={339} height={64} />
                  </span>
                </ExternalLink>
              </div>
            </div>
            <div>
              <h2 className="mb-6">Powered by</h2>
              <ExternalLink className="flex justify-center" url="https://www.climatepolicyradar.org">
                <span className="flex" data-cy="cpr-logo">
                  <Image src="/images/cclw/partners/cpr-logo.png" alt="Climate Policy Radar logo" width={353} height={64} />
                </span>
              </ExternalLink>
            </div>
          </div>
        </div>
        <div className="container my-12" data-cy="partners">
          <h2 className="text-center mb-6">Our partners</h2>
          <Partners />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
