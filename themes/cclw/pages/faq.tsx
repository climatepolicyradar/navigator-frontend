import Layout from "@components/layouts/Main";

import CCLWFAQ from "@cclw/pages/faq";

const FAQ = () => {
  return (
    <Layout
      title="FAQ"
      description="Find quick tips for how you can use this resource to explore national-level climate change laws and policies from across the world."
    >
      <CCLWFAQ />
    </Layout>
  );
};
export default FAQ;
