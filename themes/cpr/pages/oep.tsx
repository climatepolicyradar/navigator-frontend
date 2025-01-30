import Head from "next/head";

import Layout from "@components/layouts/LandingPage";

import { Hero } from "@cpr/components/oep/Hero";
import { Header } from "@cpr/components/oep/Header";
import { Footer } from "@cpr/components/oep/Footer";

const OceanEnergyPathwayPage = () => {
  return (
    <>
      <Head>
        <></>
        {/* TODO: FIX THIS AND IGNORE */}
        {/* trunk-ignore(eslint/@next/next/no-css-tags) */}
        {/* <link rel="stylesheet" href="/css/oep/oep.css" /> */}
      </Head>
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
