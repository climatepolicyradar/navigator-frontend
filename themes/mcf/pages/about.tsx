import { ExternalLink } from "@/components/ExternalLink";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const About = () => {
  return (
    <Layout
      title="About"
      description="Discover how the MCFs collaboratively developed this platform as a central hub for accessing documents, enhancing transparency, and raising awareness of their value and impact in addressing climate change."
      theme="mcf"
    >
      <BreadCrumbs label={"About us"} />
      <section className="pt-8">
        <SiteWidth>
          <SingleCol>
            <div>
              <Heading level={1} extraClasses="custom-header mb-4">
                About
              </Heading>
              <p className="text-content mb-12">
                The MCFs have agreed to jointly develop and launch this platform as a single point of entry for navigating and exploring the MCF’s
                documents (including project documents and policies). This platform will serve as a knowledge tool to raise awareness of the value and
                impact of the MCFs, facilitate the exchange of information to enhance access to the funds, and promote transparency.
              </p>
              <Heading level={2} extraClasses="custom-header">
                The Funds
              </Heading>
              <div className="text-content mb-12">
                <div className="border border-gray-300 p-4 rounded-lg flex justify-center items-center h-[304px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={"/images/mcf/AF.png"} alt={`Adaptation Fund logo`} className="h-20 w-auto" />
                </div>
                <p>
                  <strong>The Adaptation Fund</strong> (AF) finances projects and programmes that help vulnerable communities in developing countries
                  adapt to climate change.
                </p>
                <p>
                  Since 2010, the Adaptation Fund has committed over $1.2 billion for climate change adaptation and resilience projects and programs,
                  including over 175 concrete, localized projects in the most vulnerable communities of developing countries around the world with
                  over 43 million total beneficiaries.
                </p>
                <p>
                  About half of its projects are in Least Developed Countries or Small Island Developing States. It also pioneered Direct Access and
                  Enhanced Direct Access, empowering countries to access funding and develop local projects directly through accredited national
                  implementing entities.
                </p>
                <p>
                  Find more details on:{" "}
                  <ExternalLink url="https://www.adaptation-fund.org/" className="text-blue-600 underline hover:text-blue-800">
                    adaptation-fund.org
                  </ExternalLink>
                </p>
              </div>
              <div className="text-content mb-12">
                <div className="border border-gray-300 p-4 rounded-lg flex justify-center items-center h-[304px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={"/images/mcf/CIF.png"} alt={`Climate Investment Funds logo`} className="h-20 w-auto" />
                </div>
                <p>
                  <strong>The Climate Investment Funds</strong> (CIF) is a major multilateral climate fund established in 2008 to finance
                  climate-smart solutions in developing countries.
                </p>
                <p>
                  It operates exclusively through six AAA-rated multilateral development banks, providing large-scale, low-cost, long-term financing
                  to reduce risks and costs of climate investment. So far, 15 contributor countries have pledged over US$12 billion, unlocking more
                  than $64 billion in additional financing across over 80 countries.
                </p>
                <p>
                  CIF's country-led, flexible, and inclusive approach has successfully built track records in unproven green markets, incentivized
                  governments to make bold investment decisions, and crowded in additional sources of finance for pioneering climate solutions.
                </p>
                <p>
                  Find more details on:{" "}
                  <ExternalLink url="https://www.cif.org/" className="text-blue-600 underline hover:text-blue-800">
                    cif.org
                  </ExternalLink>
                </p>
              </div>
              <div className="text-content mb-12">
                <div className="border border-gray-300 p-4 rounded-lg flex justify-center items-center h-[304px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={"/images/mcf/GEF.png"} alt={`Global Environment Facility logo`} className="h-20 w-auto" />
                </div>
                <p>
                  <strong>The Global Environment Facility</strong> (GEF) is a multilateral family of funds dedicated to confronting biodiversity loss,
                  climate change, and pollution, and supporting land and ocean health.
                </p>
                <p>
                  Its financing enables developing countries to address complex challenges and work towards international environmental goals. The
                  partnership includes 186 member governments as well as civil society, Indigenous Peoples, women, and youth, with a focus on
                  integration and inclusivity.
                </p>
                <p>
                  Over the past three decades, the GEF has provided more than $25 billion in financing and mobilized $145 billion for country-driven
                  priority projects. The family of funds includes the Global Environment Facility Trust Fund, 
                  <ExternalLink
                    className="text-blue-600 underline hover:text-blue-800"
                    url="https://www.thegef.org/what-we-do/topics/global-biodiversity-framework-fund"
                  >
                    Global Biodiversity Framework Fund 
                  </ExternalLink>
                  (GBFF), 
                  <ExternalLink
                    className="text-blue-600 underline hover:text-blue-800"
                    url="https://www.thegef.org/what-we-do/topics/least-developed-countries-fund-ldcf"
                  >
                    Least Developed Countries Fund
                  </ExternalLink>
                   (LDCF),
                  <ExternalLink
                    className="text-blue-600 underline hover:text-blue-800"
                    url="https://www.thegef.org/what-we-do/topics/special-climate-change-fund-sccf"
                  >
                     Special Climate Change Fund 
                  </ExternalLink>
                  (SCCF),
                  <ExternalLink
                    className="text-blue-600 underline hover:text-blue-800"
                    url="https://www.thegef.org/what-we-do/topics/biodiversity/access-and-benefit-sharing"
                  >
                     Nagoya Protocol Implementation Fund 
                  </ExternalLink>
                  (NPIF), and Capacity-building Initiative for Transparency Trust Fund (CBIT).
                </p>
                <p>
                  Find more details on:{" "}
                  <ExternalLink className="text-blue-600 underline hover:text-blue-800" url="https://www.thegef.org/">
                    thegef.org
                  </ExternalLink>
                </p>
              </div>
              <div className="text-content mb-12">
                <div className="border border-gray-300 p-4 rounded-lg flex justify-center items-center h-[304px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={"/images/mcf/GCF.png"} alt={`Green Climate Fund logo`} className="h-20 w-auto" />
                </div>
                <p>
                  <strong>The Green Climate Fund</strong> (GEF) is the world’s largest dedicated climate fund with a mandate to foster a paradigm
                  shift towards low emission, climate-resilient development pathways in developing countries.
                </p>
                <p>
                  GCF has a portfolio of $15 billion ($58.7 billion including co-financing) delivering transformative climate action in more than 130
                  countries. The GCF readiness programme builds capacity and helps countries develop long-term plans to fight climate change.
                </p>
                <p>
                  GCF is an operating entity of the financial mechanism of the United Nations Framework Convention on Climate Change (UNFCCC) and
                  serves the 2015 Paris Agreement, supporting the climate goals.
                </p>
                <p>
                  Find more details on:{" "}
                  <ExternalLink url="https://www.greenclimate.fund/" className="text-blue-600 underline hover:text-blue-800">
                    greenclimate.fund
                  </ExternalLink>
                </p>
              </div>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};
export default About;
