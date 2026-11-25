import Image from "next/image";

import Banner from "@/components/banner/FullHeight";
import Footer from "@/components/footer/Footer";
import Layout from "@/components/layouts/LandingPage";
import { SiteWidth } from "@/components/panels/SiteWidth";
import FeatureCards from "@/cpr/components/FeatureCards";
import { Header } from "@/cpr/components/Header";
import LandingPageLinks from "@/cpr/components/LandingPageLinks";
import LandingSearchForm from "@/cpr/components/LandingSearchForm";
import { TTheme } from "@/types";

// TODO temporarily disabled: https://climate-policy-radar.slack.com/archives/C08Q8GD1CUT/p1745941756888349
// const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
//   loading: () => <p>Loading world map...</p>,
//   ssr: false,
// });

interface IProps {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  handleSearchChange: (type: string, value: unknown) => void;
  searchInput: string;
  exactMatch: boolean;
  theme: TTheme;
}

const LandingPage = ({ handleSearchInput, searchInput, theme }: IProps) => {
  return (
    <Layout metadataKey="homepage" theme={theme}>
      <div className="relative">
        <Header />
        <main className="relative h-full">
          <Banner />
          <section className="absolute inset-0 z-10 flex flex-col items-center justify-center min-h-[800px]">
            <div data-cy="cpr-logo" className="text-white flex">
              <Image src="/images/cpr-logo-homepage.png" width={596} height={34} alt="Climate Policy Radar" className="px-5" />
            </div>
            <SiteWidth extraClasses="mt-24 md:mt-48 max-w-screen-lg mx-auto">
              <LandingSearchForm handleSearchInput={handleSearchInput} input={searchInput} />
              <LandingPageLinks />
            </SiteWidth>
          </section>
        </main>
        {/* TODO: reinstate when the world map API is back */}
        {/* <FullWidth extraClasses="hidden my-6 md:block">
          <WorldMap showLitigation />
        </FullWidth> */}
        <FeatureCards />
        <Footer />
      </div>
    </Layout>
  );
};

export default LandingPage;
