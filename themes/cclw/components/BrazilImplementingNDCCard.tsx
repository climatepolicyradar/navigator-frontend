import Image from "next/image";

import { ExternalLink } from "@/components/ExternalLink";
import { Card } from "@/components/atoms/card/Card";

export const BrazilImplementingNDCCard = () => {
  return (
    <Card color="mono" variant="outlined" className="m-3 sm:m-4 !mb-8 !bg-[#F9F9F9] pointer-events-auto select-none p-0 !ml-0 !mr-0 flex">
      <div>
        {" "}
        <p className="text-base leading-normal font-semibold text-[#522CCE]">Check out Brazil&apos;s progress on implementing its NDC</p>
        <p className="mt-2 mb-4 text-sm leading-normal font-normal text-text-primary">
          NDCAlign is a tool to assess how commitments made in Nationally Determined Contributions (NDC) are being enacted through domestic laws and
          policies.
        </p>
        <ExternalLink url="https://governance.transitiondigital.org/en" className="underline text-[#522CCE]">
          Vist NDCAlign
        </ExternalLink>
      </div>
      <div className="hidden md:block">
        <Image src="/images/specks.png" alt="A screenshot showing a list of topics" width={200} height={300} />
      </div>
    </Card>
  );
};
