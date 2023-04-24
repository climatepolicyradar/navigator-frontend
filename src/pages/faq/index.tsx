import { useContext } from "react";
import { ThemeContext } from "@context/ThemeContext";
import Layout from "@components/layouts/Main";

import CCLWFAQ from "@cclw/pages/faq";

const FAQ = () => {
  const theme = useContext(ThemeContext);

  return <Layout title={"FAQ"}>{theme === "cclw" && <CCLWFAQ />}</Layout>;
};
export default FAQ;
