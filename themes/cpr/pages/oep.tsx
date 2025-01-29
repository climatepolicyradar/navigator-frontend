import Layout from "@components/layouts/LandingPage";
import { SiteWidth } from "@components/panels/SiteWidth";

import { Header } from "@cpr/components/oep/Header";
import { Footer } from "@cpr/components/oep/Footer";

const OceanEnergyPathwayPage = () => {
  return (
    <>
      <Layout title="Ocean Energy Pathway">
        <Header />
        <main className="flex flex-col flex-1">
          <section>
            <SiteWidth>{/* <OEPHero /> */}</SiteWidth>
          </section>
        </main>
        <Footer />
      </Layout>
    </>
  );
};

export default OceanEnergyPathwayPage;
