import { UrlObject } from "url";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useContext } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import Footer from "@/components/footer/Footer";
import Layout from "@/components/layouts/LandingPage";
import MainLayout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { Heading } from "@/components/typography/Heading";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { ThemePageFeaturesContext } from "@/context/ThemePageFeaturesContext";
import { Header } from "@/cpr/components/Header";
import { NavBarGradient } from "@/cpr/components/NavBarGradient";
import { isRioPolicyRadarEnabled } from "@/utils/features";

const QUERY_EXAMPLES: { label: ReactNode; href: UrlObject }[] = [
  {
    label: <span>Latest NBSAPs</span>,
    href: {
      pathname: "/search",
      query: {
        [QUERY_PARAMS.category]: "UN-submissions",
        [QUERY_PARAMS.author_type]: "Party",
        [QUERY_PARAMS["_document.type"]]: "National Biodiversity Strategy and Action Plan (NBSAP)",
      },
    },
  },
  {
    label: (
      <span>
        Land degradation&nbsp;+
        <br />
        Somalia
      </span>
    ),
    href: {
      pathname: "/search",
      query: {
        [QUERY_PARAMS.category]: "UN-submissions",
        [QUERY_PARAMS.query_string]: "Land degradation",
        [QUERY_PARAMS.country]: "somalia",
        [QUERY_PARAMS.author_type]: "Party",
      },
    },
  },
  {
    label: (
      <span>
        Brazil&nbsp;+
        <br />
        Nature-based solutions
      </span>
    ),
    href: {
      pathname: "/search",
      query: {
        [QUERY_PARAMS.category]: "UN-submissions",
        [QUERY_PARAMS.author_type]: "Party",
        [QUERY_PARAMS.country]: "brazil",
        [QUERY_PARAMS.query_string]: "Nature-based solutions",
      },
    },
  },
];

const RioSubmissions = () => {
  const { featureFlags, themeConfig } = useContext(ThemePageFeaturesContext);

  if (!isRioPolicyRadarEnabled(featureFlags, themeConfig)) {
    return (
      <MainLayout title="Rio Submissions" description="Rio Policy Radar - a shared tool for climate, nature and land" theme="cpr">
        <section className="pt-8 text-content">
          <SingleCol>
            <Heading level={1} extraClasses="mb-6">
              Coming Soon: Rio Policy Radar - a shared tool for climate, nature and land
            </Heading>
            <p>
              It is increasingly being recognised that climate change, biodiversity loss and land degradation are all closely linked and that dealing
              with them as separate issues won't work. However, policymakers face barriers finding information on how these issues are being
              approached, as this information remains siloed in disparate locations, leaving many to make decisions with missing data.
            </p>
            <p>
              To date at Climate Policy Radar we have focused more on climate and climate-related documents but we are now actively broadening our
              horizons.
            </p>
            <p>
              Launching for COP30, <i>Rio Policy Radar</i> will be a shared space for country submissions to the three “Rio” Conventions (adopted at
              the 1992 Rio Earth Summit) - the UNCBD (biodiversity), the UNCCD (land degradation) and the UNFCCC (climate). This tool will allow users
              to easily explore how countries are addressing the three interlinked issues, and their co-benefits, opportunities or trade-offs. For
              example, users will be able to discover how strategies to address nature loss are also addressing climate adaptation, or identify how
              different countries around the world are using nature-based solutions in their drought plans.
            </p>
            <p>
              For this first step we are focusing on national submissions. Going forward we will go deeper, collecting and opening up policies and
              laws that address biodiversity loss, land degradation and climate change.
            </p>
          </SingleCol>
        </section>
      </MainLayout>
    );
  }

  return (
    <Layout title="Rio Submissions" description="Rio Policy Radar - a shared tool for climate, nature and land" theme="cpr">
      <Header landingPage />
      <NavBarGradient className="!static" />
      <FiveColumns>
        <div className="pt-20 col-start-1 -col-end-1 cols5-3:col-start-2 cols5-3:-col-end-2 cols5-4:-col-end-3 cols5-5:col-start-3 cols5-5:-col-end-4">
          <span className="block text-gray-700 leading-tight">Rio Policy Radar</span>
          <h1 className="mt-3 mb-6 text-6xl text-gray-950 font-heavy leading-14 tracking-[-0.9px]">Submissions to&nbsp;the Rio&nbsp;Conventions</h1>
          <p className="my-6 text-xl text-gray-950 leading-6">
            Explore our curated collection that brings together and opens up dense, disparate documents on climate, nature and land.
          </p>
          <div className="flex gap-2">
            <Link
              href={{ pathname: "/search", query: { [QUERY_PARAMS.category]: "UN-submissions", [QUERY_PARAMS.author_type]: "Party" } }}
              className="px-4 py-3 bg-brand rounded-md text-white font-medium leading-tight"
            >
              Get started
            </Link>
            <a
              href="#examples"
              className="px-4 py-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-medium leading-tight"
            >
              See some examples
            </a>
          </div>
        </div>
        <Image
          src="/images/rio/rio-screenshot.jpg"
          alt="Climate Policy Radar's search page filtered by UN Submissions"
          width={1200}
          height={699}
          className="max-w-[1200px] w-full mx-auto mt-14 mb-10 bg-white border border-gray-200 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.10)]0 col-start-1 -col-end-1 cols5-5:col-start-2 cols5-5:-col-end-2 cursor-not-allowed"
        />
        <div className="flex flex-col gap-5 items-center col-start-1 -col-end-1">
          <span className="block text-sm text-gray-950 font-medium leading-4">In collaboration with</span>
          <div className="flex flex-col cols5-2:flex-row gap-3">
            <Image src="/images/rio/rio-unccd.svg" alt="United Nations Convention to Combat Desertification logo" width={166} height={48} />
            <Image src="/images/rio/rio-uncbd.svg" alt="Convention on Biological Diversity logo" width={166} height={48} />
            <Image src="/images/rio/rio-unfccc.svg" alt="United Nations Framework Convention on Climate Change" width={187} height={48} />
          </div>
        </div>
        <main
          className="mt-16 cols5-2:mt-32 mb-18 col-start-1 -col-end-1 cols5-4:col-start-2 cols5-4:-col-end-2 cols5-5:col-start-3 cols5-5:-col-end-3"
          id="examples"
        >
          <p className="mb-3 text-xl text-gray-950 font-heavy leading-7">
            Use our collection and full-text searchable app to search and explore submissions to the Rio&nbsp;Conventions from around the world. For
            example:
          </p>
          <ul className="pl-5 list-disc">
            <li>Explore which UNFCCC submissions include nature targets</li>
            <li>Discover the climate adaptation actions in NBSAPs</li>
            <li>Identify indicators used in different regions in country drought plans to the UNCCD</li>
          </ul>
          <p className="mt-10 mb-4 font-medium">Try these examples:</p>
          <div className="flex flex-col cols5-2:flex-row gap-2 cols5-2:gap-8 mb-20 text-brand text-center font-medium leading-tight">
            {QUERY_EXAMPLES.map(({ label, href }, index) => (
              <Link
                key={index}
                href={href}
                className="flex-1 flex items-center justify-center px-4 py-6 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                {label}
              </Link>
            ))}
          </div>
          <h2 className="mb-2 text-xl text-gray-950 font-heavy leading-7">About</h2>
          <p className="mb-6">
            Our collection currently represents the most recent submissions from across the three Rio Conventions. We will be continually updating
            this with both historical and the latest submissions.
          </p>
          <p className="mb-6">You can also use our collection to navigate thousands of climate documents beyond UN submissions.</p>
          <p className="mb-16">
            We are working on adding new functionality and bringing in more and more datasets. If this interests you,{" "}
            <ExternalLink url="https://www.climatepolicyradar.org/collaborate" className="inline-block underline">
              please get in touch
            </ExternalLink>
            .
          </p>
          <h2 className="mb-2 text-xl text-gray-950 font-heavy leading-7">Methodology</h2>
          <p className="mb-6">
            This collection is powered by Climate Policy Radar, turning documents from every country into searchable, accessible, and useful
            information.
          </p>
          <p className="mb-6">
            We build and train models that can automatically read and extract text from PDFs and websites, enabling us to structure and share
            information from thousands of documents.
          </p>
          <p className="mb-3 font-medium">Our models are:</p>
          <ul className="pl-5 list-disc">
            <li>Trained on expert-built, topic-relevant knowledge</li>
            <li>Reviewed and improved by researchers and policy professionals</li>
            <li>Transparent, multilingual, and auditable by design</li>
          </ul>
        </main>
      </FiveColumns>
      <Footer />
    </Layout>
  );
};

export default RioSubmissions;
