import { useContext } from "react";
import { ThemeContext } from "@context/ThemeContext";
import Layout from "@components/layouts/Main";

import CCLWFAQ from "@cclw/pages/faq";

const FAQ = () => {
  const theme = useContext(ThemeContext);

  return (
    <Layout
      title="FAQ"
      description="Find quick tips for how you can use this resource to explore national-level climate change laws and policies from across the world."
    >
      {theme === "cclw" && <CCLWFAQ />}
    </Layout>
  );
};
export default FAQ;
