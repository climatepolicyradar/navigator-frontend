import Layout from "@components/layouts/LandingPage";

import { Hero } from "@cpr/components/oep/Hero";
import { Header } from "@cpr/components/oep/Header";
import { Footer } from "@cpr/components/oep/Footer";

const OceanEnergyPathwayPage = () => {
  return (
    <>
      <Layout title="Ocean Energy Pathway">
        <Header />
        <main id="oep">
          <Hero />
        </main>
        <Footer />
      </Layout>
    </>
  );
};

export default OceanEnergyPathwayPage;
