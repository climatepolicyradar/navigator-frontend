import Head from "next/head";
import Image from "next/image";

import { ExternalLink } from "@/components/ExternalLink";
import Layout from "@/components/layouts/LandingPage";
import { Header } from "@/cpr/components/Header";
import { ColumnAndImage } from "@/cpr/components/oep/ColumnAndImage";
import { EqualColumn, EqualColumns } from "@/cpr/components/oep/EqualColumns";
import { Footer } from "@/cpr/components/oep/Footer";
import { Hero } from "@/cpr/components/oep/Hero";
import { Narrow } from "@/cpr/components/oep/Narrow";
import { Section } from "@/cpr/components/oep/Section";

const OceanEnergyPathwayPage = () => {
  return (
    <>
      <Head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/css/oep/oep.css" />
      </Head>
      <Layout title="Ocean Energy Pathway" description="Helping the offshore wind sector design effective strategies" theme="cpr">
        <Header landingPage />
        <main id="oep" className="relative">
          <Hero />

          <Section containerClasses="py-12 md:pt-[120px] md:pb-[80px]">
            <Narrow extraClasses="mb-9 md:mb-[80px]">
              <p className="font-medium text-2xl">
                The POWER <span className="italic">(Publications on Offshore Wind Energy Research)</span> Library, developed by Climate Policy Radar
                and curated by Ocean Energy Pathway, is a new resource for offshore wind energy, designed to underpin more effective offshore wind
                energy strategies worldwide.
              </p>
            </Narrow>
            <ColumnAndImage extraClasses="md:max-w-[420px] min-h-[400px]">
              <Image
                className="lg:absolute lg:right-0 order-1 max-w-full lg:max-w-[50%] mx-auto md:mx-0 mt-9 lg:mt-0"
                alt="An offshore wind farm"
                src="/images/oep/OEP-wind-farm.jpg"
                height={398}
                width={708}
              />
              <p className="text-lg">
                With this tool, you can find information on offshore wind from around the globe, including legislation, government policies,
                strategies, offshore wind reports, analyses and policy recommendations from researchers and civil society. You can search for keywords
                and policy topics across the full text of all documents, viewing your search term and related phrases highlighted in the search
                results.
              </p>
            </ColumnAndImage>
          </Section>

          <Section sectionClasses="bg-oep-royal-blue" containerClasses="py-12 text-4xl text-[40px] font-bold font-tenez text-white">
            <div className="md:flex gap-8 relative">
              <div className="hidden md:block flex-1 relative">
                <div className="h-screen sticky top-0 flex items-center justify-center">
                  <Image
                    className="mx-auto md:mx-0 mt-9 lg:mt-0"
                    alt="An offshore wind turbine and maintenance ship seen from above"
                    src="/images/oep/OEP-wind-turbine.jpg"
                    height={416}
                    width={416}
                  />
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="md:flex flex-col md:mt-[45vh] md:mb-[45vh] items-center justify-center">
                  <p className="mb-9 md:mb-[280px]">
                    <span className="text-oep-salmon">Understand</span> best practices and learnings from different regions of the world
                  </p>
                  <p className="mb-9 md:mb-[280px]">
                    <span className="text-oep-salmon">Stay updated</span> on recent trends and expert analyses on a wide variety of topics related to
                    offshore wind
                  </p>
                  <p className="mb-9 md:mb-[280px]">
                    <span className="text-oep-salmon">Identify</span> stakeholders and experts with best-in-class information
                  </p>
                  <p className="">
                    <span className="text-oep-salmon">Help</span> design and implement effective strategies for sustainable offshore wind development
                  </p>
                </div>
              </div>
            </div>
          </Section>

          <Section containerClasses="text-lg py-12 md:pt-[120px] md:pb-[160px] oep-feature-line-bg" sectionClasses="oep-feature-wave-bg">
            <Narrow extraClasses="mb-9 md:mb-[160px]">
              <h1 className="mb-[50px] text-oep-dark-blue text-6xl text-[64px] font-bold font-tenez">Why offshore wind</h1>
              <p className="font-medium text-2xl">
                Offshore wind energy is a key technology for meeting the global target to triple renewables by 2030, keeping the Paris-aligned 1.5
                degrees scenario alive, and bolstering energy security — all while driving economic growth, supporting green industrialisation, and
                bringing benefits to local communities.
              </p>
            </Narrow>
            <ColumnAndImage extraClasses="mb-9 md:mb-[90px]">
              <h2 className="text-oep-dark-blue text-5xl font-bold font-tenez">But there are challenges to scale...</h2>
            </ColumnAndImage>
            <ColumnAndImage>
              <Image
                className="lg:absolute lg:right-0 order-1 max-w-full lg:max-w-[50%] mx-auto md:mx-0 mt-9 lg:mt-0 z-10"
                alt="A wind turbine under construction"
                src="/images/oep/OEP-wind-turbine-construction.jpg"
                height={410}
                width={620}
              />
              <p className="mb-9">To achieve sustainable growth and meet the immense potential of offshore wind, countries must:</p>
              <ul className="mb-9">
                <li className="ml-6 list-disc">
                  Establish new policy and regulatory frameworks that can unlock investment and accelerate development;
                </li>
                <li className="ml-6 list-disc">
                  Recognise the potential of offshore wind as a transformative blue economy solution with opportunities for job creation, industrial
                  decarbonisation, and coastal community revitalisation;
                </li>
                <li className="ml-6 list-disc">Secure social and political support for offshore wind;</li>
                <li className="ml-6 list-disc">Adapt to the needs and circumstances of the local communities and economies; and</li>
                <li className="ml-6 list-disc">
                  Work in harmony with nature, recognising that a biodiversity crisis exists alongside the climate crisis.
                </li>
              </ul>
              <p>
                Offshore wind is a quickly-evolving sector, with an ever-growing influx of data, policy documents, and industry expertise. To design
                and implement effective strategies for rapid, sustainable, high-ambition deployment of offshore wind, decision-makers need access to
                reliable information. Stakeholders seeking information on offshore wind often find identifying and selecting relevant information
                challenging, time-consuming, and expensive, as resources and data are spread across different sources and platforms.
              </p>
            </ColumnAndImage>
          </Section>

          <Section containerClasses="text-lg py-12 md:pt-[120px] md:pb-[200px]">
            <div className="md:max-w-[780px] mx-auto">
              <h1 className="text-oep-dark-blue text-6xl text-[56px] font-bold font-tenez mb-9 md:mb-[120px]">
                The POWER Library addresses this challenge and provides an accessible, one-stop search tool for offshore wind resources.
              </h1>
            </div>
            <EqualColumns reverseColumn>
              <EqualColumn>
                <Image
                  className="mx-auto md:mx-0 mt-9 lg:mt-0"
                  alt="A wind farm worker stands on an assembled wind turbine's blade"
                  src="/images/oep/OEP-wind-farm-worker.jpg"
                  height={328}
                  width={328}
                />
              </EqualColumn>
              <EqualColumn>
                <p>
                  The POWER Library collection has been expertly curated by Ocean Energy Pathway, drawing from a wide range of best-in-class, publicly
                  accessible publications on offshore wind. We have selected high-quality research to provide valuable insights to a global audience.
                  Our collection spans a comprehensive range of essential topics related to the sustainable development of offshore wind, including
                  policy frameworks, market trends and innovation, socioeconomic impacts, and considerations for environmental sustainability and
                  biodiversity.
                </p>
              </EqualColumn>
            </EqualColumns>
          </Section>

          <Section sectionClasses="bg-oep-royal-blue oep-feature-wave-dark" containerClasses="py-12 md:py-[160px] text-white relative z-10">
            <EqualColumns>
              <EqualColumn>
                <h2 className="mb-9 md:mb-12 items-end text-oep-salmon text-5xl font-bold font-tenez">Contribute to our growing database</h2>
                <p className="text-lg">
                  If you’ve spotted missing data or would like to contribute materials to our POWER Library,{" "}
                  <ExternalLink className="text-white underline hover:text-white" url="https://form.jotform.com/233294135296359">
                    please let us know here
                  </ExternalLink>
                  .
                </p>
              </EqualColumn>
              <EqualColumn extraClasses="mt-9 md:mt-0 md:self-end flex flex-row flex-wrap md:justify-end gap-y-4 gap-x-8">
                <ExternalLink url="https://www.climatepolicyradar.org" className="flex">
                  <Image src="/images/cpr-logo-horizontal-dark.svg" width={215} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
                </ExternalLink>
                <ExternalLink url="https://www.oceanenergypathway.org" className="flex">
                  <Image
                    src="/images/oep/OEP-logo.svg"
                    width={155}
                    height={100}
                    alt="Ocean Energy Pathway logo"
                    data-cy="oep-logo"
                    className="invert"
                  />
                </ExternalLink>
              </EqualColumn>
            </EqualColumns>
          </Section>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default OceanEnergyPathwayPage;
