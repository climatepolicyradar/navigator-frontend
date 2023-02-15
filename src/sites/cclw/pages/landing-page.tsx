import React from "react";
import dynamic from "next/dynamic";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Hero } from "../components/Hero";
import { Articles } from "../components/Articles";
import { Partners } from "@cclw/components/Partners";

const Map = dynamic(() => import("@components/map/Map"), {
  ssr: false,
});

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
        <div className="container mt-12">
          <div className="p-4 border border-lineBorder border-b-transparent bg-offwhite">
            <h4>World Map</h4>
            <p>The World Map helps you find and navigate to the country-level details page. In the future we will add more data to the map.</p>
          </div>
          <div className="border border-lineBorder aspect-square md:aspect-video lg:aspect-[3/1]">
            <Map />
          </div>
        </div>
        <div className="container mt-12">
          <h2 className="text-center mb-6">Featured Content</h2>
          <Articles />
        </div>
        <div className="container mt-12">
          <h2 className="text-center mb-6">Our partners</h2>
          <Partners />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
