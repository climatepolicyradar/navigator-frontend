import Image from "next/image";

import { SingleCol } from "@components/panels/SingleCol";

export const Hero = () => {
  return (
    <section>
      <div className="h-[800px] relative z-1 overflow-hidden">
        <div className="oep-hero-left oep-hero-background"></div>
        <div className="oep-hero-bg oep-hero-background"></div>
        <div className="oep-hero-right oep-hero-background"></div>
        <SingleCol>
          <div className="relative z-10 pt-[218px] pb-[100px]">
            <div className="mb-6">
              <Image src="/images/oep/oep-logo-small.png" width={155} height={54} alt="Ocean Energy Pathway logo" data-cy="oep-logo" />
            </div>
            <h1 className="font-['tenez'] italic text-oep-royal-blue text-8xl tracking-[-0.96px] leading-[0.8]">
              <span className="not-italic">POWER</span> library
            </h1>
            <p className="my-9 text-2xl text-textDark">Helping the offshore wind sector design effective strategies</p>
          </div>
        </SingleCol>
      </div>
    </section>
  );
};
