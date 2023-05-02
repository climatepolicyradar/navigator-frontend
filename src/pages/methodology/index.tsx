import { useContext } from "react";
import { ThemeContext } from "@context/ThemeContext";
import Layout from "@components/layouts/Main";

import CCLWMethodology from "@cclw/pages/methodology";

const Methodology = () => {
  const theme = useContext(ThemeContext);

  return (
    <Layout
      title="Methodology"
      description="Find the definitions, scope and principles we use to collect and categorise the laws and policies contained in the Climate Change Laws of the World dataset."
    >
      {theme === "cclw" && <CCLWMethodology />}
    </Layout>
  );
};
export default Methodology;
