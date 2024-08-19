import Layout from "@components/layouts/Main";

import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";

const Methodology = () => {
  return (
    <Layout title="Methodology" description="Find the definitions, scope and principles we use to collect and categorise the laws and policies.">
      <section>
        <div className="container px-4">
          <BreadCrumbs label={"Methodology"} />
          <div className="text-content mb-12">
            <h1 className="my-8">Methodology</h1>
            <h2 id="introduction">Introduction</h2>
            <p className="italic">This page was last updated on XX XXXX XX.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default Methodology;
