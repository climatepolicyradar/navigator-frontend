import Layout from "@components/layouts/LandingPage";
import { ColumnAndImage } from "@cpr/components/oep/ColumnAndImage";
import { EqualColumn, EqualColumns } from "@cpr/components/oep/EqualColumns";
import { Footer } from "@cpr/components/oep/Footer";
import { Header } from "@cpr/components/oep/Header";
import { Hero } from "@cpr/components/oep/Hero";
import { Narrow } from "@cpr/components/oep/Narrow";
import { Section } from "@cpr/components/oep/Section";
import Image from "next/image";
import Link from "next/link";

const OceanEnergyPathwayPage = () => {
  return (
    <Layout title="Ocean Energy Pathway">
      <Header />
      <main id="oep">
        <Hero />

        <Section>
          <div className="mt-[120px]">
            <Narrow>
              <p className="font-medium text-2xl">
                The POWER <span className="italic">(Publications on Offshore Wind Energy Research)</span> Library is a project run in partnership
                between Climate Policy Radar and Ocean Energy Pathway, aimed at providing an accessible and reliable reference on offshore wind energy
                and helping policymakers and stakeholders around the world design more effective strategies.
              </p>
            </Narrow>
          </div>
          <div className="my-[80px]">
            <p className="text-lg">
              With this tool, you can find information on offshore wind from around the globe, including legislation, government policies, strategies,
              industry reports, analyses and policy recommendations from researchers and civil society. You can search for keywords and policy
              concepts across the full text of all documents, viewing your search term and related phrases highlighted in the search results.
            </p>
            {/* image: wind farm */}
          </div>
        </Section>

        <Section sectionClasses="bg-oep-royal-blue" containerClasses="text-4xl text-[40px] font-bold font-tenez text-white">
          <EqualColumns extraClasses="my-[135px]">
            <EqualColumn>img</EqualColumn>
            <EqualColumn>
              <p className="mb-[280px]">
                <span className="text-oep-salmon">Understand</span> best practices and learnings from different regions of the world
              </p>
              <p>
                <span className="text-oep-salmon">Stay updated</span> on recent trends and expert analyses on a wide variety of topics related to
                offshore wind
              </p>
            </EqualColumn>
          </EqualColumns>
        </Section>

        <Section containerClasses="text-lg">
          <Narrow extraClasses="mt-[120px] mb-[160px]">
            <h1 className="mb-[50px] text-oep-dark-blue text-6xl text-[64px] font-bold font-tenez">Why offshore wind</h1>
            <p className="font-medium text-2xl">
              Offshore wind energy is a key technology for meeting the global target to triple renewables by 2030, keeping the Paris-aligned 1.5
              degree scenario alive, and bolstering energy security — all while driving economic growth, supporting green industrialisation, and
              bringing benefits to local communities.
            </p>
          </Narrow>
          <ColumnAndImage extraClasses="mb-[160px]">
            <div className="mb-[90px]">
              <h2 className="text-oep-dark-blue text-5xl font-bold font-tenez">But there are challenges to scale...</h2>
            </div>
            <div>
              <p className="mb-9">To achieve sustainable growth and meet the immense potential of offshore wind, countries must:</p>
              <ul className="mb-9">
                <li className="ml-6 list-disc">
                  Establish new policy and regulatory framework that can unlock investment and accelerate development;
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
              <p className="mb-9">
                To design and implement effective strategies for rapid, sustainable, high-ambition deployment of offshore wind, decision-makers need
                access to reliable and relevant information.
              </p>
              <p>
                Offshore wind is a quickly-evolving sector, with an ever-growing influx of data, policy documents, and industry expertise.
                Policymakers, researchers, and others seeking information on offshore wind often find identifying and selecting relevant information
                challenging, time-consuming, and expensive, as resources and data are spread across different sources and platforms.
              </p>
            </div>
          </ColumnAndImage>
        </Section>

        <Section containerClasses="text-lg">
          <div className="max-w-[780px] mx-auto my-[120px]">
            <h1 className="text-oep-dark-blue text-6xl text-[56px] font-bold font-tenez">
              The POWER Library addresses this challenge and provides an accessible, one-stop search tool for offshore wind resources.
            </h1>
          </div>
          <EqualColumns extraClasses="mb-[200px]">
            <EqualColumn>
              <Image alt="TODO" src="/images/oep/wind-farm-worker.jpg" height={328} width={328} />
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

        <Section sectionClasses="bg-oep-royal-blue" containerClasses="my-[160px] text-white">
          <EqualColumns>
            <EqualColumn>
              <h2 className="mb-12 items-end text-oep-salmon text-5xl font-bold font-tenez">Contribute to our growing our database</h2>
              <p className="text-lg">
                If you’ve spotted missing data or would like to contribute materials to our POWER Library,{" "}
                <Link className="text-white underline hover:text-white" href="#">
                  please let us know here
                </Link>
                .
              </p>
            </EqualColumn>
            <EqualColumn extraClasses="self-end flex flex-row justify-end gap-8">
              <Image src="/images/cpr-logo-horizontal-dark.svg" width={215} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
              <Image src="/images/oep/OEP-logo.svg" width={155} height={100} alt="Ocean Energy Pathway logo" data-cy="oep-logo" className="invert" />
            </EqualColumn>
          </EqualColumns>
        </Section>
      </main>

      <Footer />
    </Layout>
  );
};

export default OceanEnergyPathwayPage;
