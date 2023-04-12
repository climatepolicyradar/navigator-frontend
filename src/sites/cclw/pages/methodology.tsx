import { AccordianItem } from "@cclw/components/AccordianItem";
import { METHODOLOGY } from "@cclw/constants/methodologyItems";

const Methodology = () => {
  return (
    <section>
      <div className="text-content px-4 container mb-12">
        <h1 className="my-8">Methodology</h1>
        <h2 id="introduction">Introduction</h2>
        <p className="italic">This page was last updated on 30 March 2022.</p>
        <p>
          This page outlines the definitions, scope and principles used to collect and categorise the <b className="font-bold">laws and policies</b>{" "}
          contained in the Climate Change Laws of the World dataset. This dataset originates from a collaboration between the Grantham Research
          Institute at LSE and GLOBE International on a series of Climate Legislation Studies. The dataset is currently maintained by LSE, in
          partnership with Climate Policy Radar.
        </p>
        <p>
          Classifications described below have been assigned manually. LSE, Climate Policy Radar, and our partners are currently working to develop
          classifications powered by AI. Sign up to our newsletter to receive updates.
        </p>

        {METHODOLOGY.map((item, i) => (
          <>
            <AccordianItem title={item.title} key={item.title}>
              {item.content}
            </AccordianItem>
            <hr />
          </>
        ))}
        
      </div>
    </section>
  );
};
export default Methodology;
