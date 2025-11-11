import Image from "next/image";

import { ExternalLink } from "@/components/ExternalLink";
import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { Divider } from "@/components/dividers/Divider";

export const PoweredBy = () => (
  <div className="py-6">
    <div className="w-full mx-auto px-3 mb-8">
      <Divider />
    </div>

    <FiveColumns className="gap-y-6">
      <p className="text-xl font-semibold text-text-primary col-span-2 cols-4:col-start-2 cols-5:col-start-1">Powered by:</p>
      <div className="flex flex-col gap-6 -col-end-1 col-start-1 cols-3:col-start-3 cols-4:col-start-4">
        <ExternalLink
          className="text-text-secondary text-base underline leading-normal flex items-center gap-2"
          url="https://www.climatepolicyradar.org"
        >
          <Image src="/images/climate-text.svg" width={50} height={30} alt="Climate" data-cy="cpr-logo-climate-text" className="w-auto" />
          <Image src="/images/new-cpr-radar-logo.svg" width={30} height={30} alt="Climate Policy Radar logo" data-cy="cpr-logo" className="w-auto" />
          <Image
            src="/images/policy-radar-text.svg"
            width={50}
            height={30}
            alt="Policy Radar"
            data-cy="cpr-logo-policy-radar-text"
            className="w-auto"
          />
        </ExternalLink>
        <div className="flex flex-col gap-4">
          <p className="text-text-secondary text-base leading-normal">
            Climate Policy Radar uses AI and data science
            <br />
            to map the world's climate documents.
          </p>
          <p className="text-text-secondary text-base leading-normal">
            Visit{" "}
            <ExternalLink className="underline" url="https://www.climatepolicyradar.org">
              climatepolicyradar.org
            </ExternalLink>
          </p>
        </div>
      </div>
    </FiveColumns>
  </div>
);
