import Image from "next/image";
import Link from "next/link";
import { ReactNode, useContext } from "react";

import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import Footer from "@/components/footer/Footer";
import Layout from "@/components/layouts/LandingPage";
import MainLayout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { Heading } from "@/components/typography/Heading";
import { ThemePageFeaturesContext } from "@/context/ThemePageFeaturesContext";
import { Header } from "@/cpr/components/Header";
import { NavBarGradient } from "@/cpr/components/NavBarGradient";
import { isRioPolicyRadarEnabled } from "@/utils/features";

const QUERY_EXAMPLES: { label: ReactNode; href: string }[] = [
  { label: <span>Latest NBSAPs</span>, href: "/" },
  {
    label: (
      <span>
        Land degradation&nbsp;+
        <br />
        Somalia
      </span>
    ),
    href: "/",
  },
  {
    label: (
      <span>
        Brazil&nbsp;+
        <br />
        Nature-based solutions
      </span>
    ),
    href: "/",
  },
];

const RioSubmissions = () => {
  const { featureFlags } = useContext(ThemePageFeaturesContext);

  if (!isRioPolicyRadarEnabled(featureFlags)) {
    return (
      <MainLayout title="Rio Submissions" description="Rio Policy Radar - a shared tool for climate, nature and land" theme="cpr">
        <section className="pt-8 text-content">
          <SingleCol>
            <Heading level={1} extraClasses="mb-6">
              COMING SOON: Rio Policy Radar - a shared tool for climate, nature and land
            </Heading>
            <p>
              Increasingly, policymakers working across environmental issues need to make informed decisions that straddle climate, biodiversity and
              land use. But national policy information on these remains siloed in disparate locations, leaving many to make decisions with missing
              data.
            </p>
            <p>
              Currently, our Climate Policy Radar tool houses all national <Link href="/search?c=UNFCCC">UNFCCC submissions</Link>. However, CPR will
              soon become a shared space for submissions from the two other "Rio Conventions" - the CBD (biodiversity) and the UNCCD (land
              degradation).
            </p>
            <p>
              Launching at COP30, <i>Rio Policy Radar</i> will allow users to readily explore synergies amongst national plans that address the three
              interlinked issues. For example, users will be able to discover how strategies to address nature loss are also addressing climate
              adaptation, or identify how different countries around the world are using nature-based solutions in their drought plans.
            </p>
            <p>
              CPR will continue to expand this collection to bring in historical submissions, other relevant planning documents and eventually
              sub-national documents.
            </p>
            <p>More information will be added to this site soon.</p>
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
            <Link href="/" className="px-4 py-3 bg-brand rounded-md text-white font-medium leading-tight">
              Get started
            </Link>
            <Link href="/" className="px-4 py-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-medium leading-tight">
              See some examples
            </Link>
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
        <main className="mt-16 cols5-2:mt-32 mb-18 col-start-1 -col-end-1 cols5-4:col-start-2 cols5-4:-col-end-2 cols5-5:col-start-3 cols5-5:-col-end-3">
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
            <Link href="/" className="inline-block underline">
              please get in touch
            </Link>
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
