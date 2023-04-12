import { ExternalLink } from "@components/ExternalLink";
import { useState } from "react";

const FAQ = () => {
  const [openSections, setOpenSections] = useState([1]);

  const toggleSection = (sectionId: number) => {
    if (openSections.includes(sectionId)) {
      setOpenSections(openSections.filter((id) => id !== sectionId));
    } else {
      setOpenSections([...openSections, sectionId]);
    }
  };

  return (
    <section>
      <div className="text-content px-4 container mb-12">
        <h1 className="my-8">How to use this resource</h1>
      </div>
    </section>
  );
};

export default FAQ;
