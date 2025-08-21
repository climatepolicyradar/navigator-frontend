import dynamic from "next/dynamic";

import { Footer } from "@/ccc/components/Footer";
import Header from "@/ccc/components/Header";
import { Hero } from "@/ccc/components/Hero";
import Layout from "@/components/layouts/LandingPage";
import { FullWidth } from "@/components/panels/FullWidth";
import { TTheme, TThemeConfig } from "@/types";

const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
  loading: () => <p>Loading world map...</p>,
  ssr: false,
});

interface IProps {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
  theme: TTheme;
  themeConfig: TThemeConfig;
}

const LandingPage = ({ handleSearchInput, searchInput, theme, themeConfig }: IProps) => {
  return (
    <Layout theme={theme} themeConfig={themeConfig} metadataKey="homepage">
      <main id="main" className="h-screen flex flex-col bg-[rebeccapurple]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} />
        </div>
      </main>
      <FullWidth extraClasses="hidden my-6 md:block">
        <WorldMap showLitigation showCategorySelect={false} theme="ccc" />
      </FullWidth>
      <Footer />
    </Layout>
  );
};

export default LandingPage;
