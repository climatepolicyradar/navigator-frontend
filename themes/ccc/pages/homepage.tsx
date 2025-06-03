import Header from "@/ccc/components/Header";
import { Hero } from "@/ccc/components/Hero";
import { APP_NAME, PAGE_DESCRIPTION } from "@/ccc/constants/pageMetadata";
import Layout from "@/components/layouts/LandingPage";

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
    </Layout>
  );
};

export default LandingPage;
