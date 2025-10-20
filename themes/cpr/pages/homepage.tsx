import Banner from "@/components/banner/FullHeight";
import Footer from "@/components/footer/Footer";
import Header from "@/components/headers/LandingPage";
import Layout from "@/components/layouts/LandingPage";
import AlphaLogo from "@/components/logo/AlphaLogo";
import { SiteWidth } from "@/components/panels/SiteWidth";
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
  searchInput: string;
  theme: TTheme;
  themeConfig: TThemeConfig;
}

const LandingPage = ({ handleSearchInput, searchInput, theme, themeConfig }: IProps) => {
  return (
    <Layout metadataKey="homepage" theme={theme} themeConfig={themeConfig}>
      <div className="relative">
        <Header />
        <main className="relative h-full">
          <Banner />
          <section className="absolute inset-0 z-10 flex flex-col items-center justify-center min-h-[800px]">
            <AlphaLogo />
            <SiteWidth extraClasses="mt-24 md:mt-48 max-w-screen-lg mx-auto">
              <LandingSearchForm handleSearchInput={handleSearchInput} input={searchInput} />
              <div className="mt-12">
                <LandingPageLinks />
              </div>
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
      </div>
    </Layout>
  );
};

export default LandingPage;
