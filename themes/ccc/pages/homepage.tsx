import dynamic from "next/dynamic";
import Image from "next/image";

import { FeatureDiscover } from "@/ccc/components/FeatureDiscover";
import { Footer } from "@/ccc/components/Footer";
import Header from "@/ccc/components/Header";
import { Hero } from "@/ccc/components/Hero";
import { PoweredBy } from "@/ccc/components/PoweredBy";
import Layout from "@/components/layouts/LandingPage";
import { FullWidth } from "@/components/panels/FullWidth";
import { SiteWidth } from "@/components/panels/SiteWidth";
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
  exactMatch: boolean;
  handleSearchChange: (type: string, value: any) => void;
}

const LandingPage = ({ handleSearchInput, searchInput, theme, themeConfig, exactMatch }: IProps) => {
  return (
    <Layout theme={theme} themeConfig={themeConfig} metadataKey="homepage">
      <Header />
      <main id="main" className="md:h-screen">
        <SiteWidth extraClasses="md:flex justify-between p-10 pt-0 pb-14 h-full md:gap-10 lg:gap-16 md:h-[calc(100%-220px)] lg:h-[calc(100%-280px)] xl:h-[calc(100%-344px)]">
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} exactMatch={exactMatch} />
        </SiteWidth>
        <FullWidth extraClasses="hidden md:block relative md:h-[220px] lg:h-[280px] xl:h-[344px]">
          <Image src="/images/ccc/water_ice_reflection.jpg" alt="Water reflection in ice" fill className="w-full object-cover" priority />
        </FullWidth>
      </main>
      <SiteWidth extraClasses="hidden my-6 md:block">
        <WorldMap showLitigation showCategorySelect={false} theme="ccc" />
      </SiteWidth>
      <FeatureDiscover />
      <PoweredBy />
      <Footer />
    </Layout>
  );
};

export default LandingPage;
