import { ExternalLink } from "@/components/ExternalLink";

export const BrazilImplementingNDCBanner = () => {
  return (
    <div className="bg-[#22FFD3] w-full flex justify-center items-center p-6 md:p-2 font-medium text-sm min-h-[56px] text-[#2E3150]">
      <div className="text-center flex flex-col gap-2 md:block">
        <span className="font-bold">
          Check out Brazil&apos;s progress on implementing its NDC - assess whether commitments are aligned with domestic laws and policies.{"   "}
        </span>
        <ExternalLink className="underline" url="https://governance.transitiondigital.org/en">
          Visit NDCAlign
        </ExternalLink>
      </div>
    </div>
  );
};
