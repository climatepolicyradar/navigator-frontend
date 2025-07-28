import dynamic from "next/dynamic";

import Header from "@/ccc/components/Header";
import { Hero } from "@/ccc/components/Hero";
import { APP_NAME, PAGE_DESCRIPTION } from "@/ccc/constants/pageMetadata";
import Layout from "@/components/layouts/LandingPage";
import { FullWidth } from "@/components/panels/FullWidth";

const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
  loading: () => <p>Loading world map...</p>,
  ssr: false,
});
interface IProps {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
}

const LandingPage = ({ handleSearchInput, searchInput }: IProps) => {
  return (
    <Layout title="Climate Case Chart" theme={APP_NAME} description={PAGE_DESCRIPTION}>
      <main id="main" className="h-screen flex flex-col bg-[rebeccapurple]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} />
        </div>
      </main>
      <FullWidth extraClasses="hidden my-6 md:block">
        <WorldMap showLitigation />
      </FullWidth>
    </Layout>
  );
};

export default LandingPage;
