import dynamic from "next/dynamic";
import Image from "next/image";

import { Footer } from "@/ccc/components/Footer";
import { Hero } from "@/ccc/components/Hero";
import { PoweredBy } from "@/ccc/components/PoweredBy";
import { ExternalLink } from "@/components/ExternalLink";
import Layout from "@/components/layouts/LandingPage";
import { FullWidth } from "@/components/panels/FullWidth";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";
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
      <main id="main" className="md:h-screen">
        <SiteWidth extraClasses="md:flex justify-between p-10 pb-14 h-full md:gap-10 lg:gap-16 md:h-[calc(100%-220px)] lg:h-[calc(100%-280px)] xl:h-[calc(100%-344px)]">
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} exactMatch={exactMatch} />
        </SiteWidth>
        <FullWidth extraClasses="hidden md:block relative md:h-[220px] lg:h-[280px] xl:h-[344px]">
          <Image src="/images/ccc/water_ice_reflection.jpg" alt="Water reflection in ice" fill className="w-full object-cover" priority />
        </FullWidth>
      </main>
      <SiteWidth extraClasses="hidden my-6 md:block">
        <WorldMap showLitigation showCategorySelect={false} theme="ccc" />
      </SiteWidth>
      <SiteWidth>
        <div>
          <div className="lg:w-1/2 lg:z-10">
            <Heading level={2} extraClasses="custom-header">
              About the Climate Litigation Database
            </Heading>
            <p>
              The <b>Sabin Center for Climate Change Law's Climate Litigation Database</b> is the most comprehensive resource tracking climate change
              litigation worldwide. It contains more than 3,000 cases that address climate change law, policy, and science.
            </p>
            <br />
            <ExternalLink className="text-blue-500 underline hover:text-blue-800" url="https://mailchi.mp/law/sabin-center-litigation-newsletter">
              Subscribe to the Sabin Center Climate Litigation Newsletter
            </ExternalLink>{" "}
            for twice-monthly updates. Each issue includes the latest case updates, event announcements, and publication highlights.
          </div>
        </div>
      </SiteWidth>
      <PoweredBy />
      <Footer />
    </Layout>
  );
};

export default LandingPage;
