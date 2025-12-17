import Image from "next/image";
import { HackathonModal } from "src/HACKATHON/modal";

import Banner from "@/components/banner/FullHeight";
import Footer from "@/components/footer/Footer";
import Layout from "@/components/layouts/LandingPage";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Header } from "@/cpr/components/Header";
import LandingPageLinks from "@/cpr/components/LandingPageLinks";
import LandingSearchForm from "@/cpr/components/LandingSearchForm";
import Partners from "@/cpr/components/Partners";
import Summary from "@/cpr/components/Summary";
import { TTheme, TThemeConfig } from "@/types";

// TODO temporarily disabled: https://climate-policy-radar.slack.com/archives/C08Q8GD1CUT/p1745941756888349
// const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
//   loading: () => <p>Loading world map...</p>,
//   ssr: false,
// });

/**
 * GOTCHA: we export this to be used in the src/pages/index.tsx file.
 * It's a generic passed to `dynamic` so we can't rely on generic type checking.
 */
export interface IProps {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  handleSearchChange: (type: string, value: any) => void;
  searchInput: string;
  exactMatch: boolean;
  theme: TTheme;
  themeConfig: TThemeConfig;
}

const LandingPage = ({ handleSearchInput, handleSearchChange, searchInput, exactMatch, theme, themeConfig }: IProps) => {
  return (
    <Layout metadataKey="homepage" theme={theme} themeConfig={themeConfig}>
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
        <Summary />
        <Partners />
        <Footer />
        <HackathonModal />ß
      </div>
    </Layout>
  );
};

export default LandingPage;
