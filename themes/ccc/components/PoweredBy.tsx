import Image from "next/image";

import { ExternalLink } from "@/components/ExternalLink";
import { Columns } from "@/components/atoms/columns/Columns";
import { Divider } from "@/components/dividers/Divider";

export const PoweredBy = () => (
  <div className="py-6 pb-6">
    <div className="w-full mx-auto px-3 mb-8">
      <Divider />
    </div>

    <Columns>
      <aside className="flex flex-col items-start cols-2:col-span-2 cols-3:col-span-1">
        <p className="text-xl font-semibold text-text-primary">Powered by:</p>
      </aside>

      <main className="cols-2:col-span-2 cols-4:col-span-3 grid grid-cols-subgrid gap-6">
        <div className="col-span-full text-text-secondary flex flex-col justify-center ">
          <ExternalLink
            className="text-text-secondary text-base underline leading-normal flex items-center gap-2"
            url="https://www.climatepolicyradar.org"
          >
            <Image src="/images/climate-text.svg" width={0} height={0} alt="Climate" data-cy="cpr-logo-climate-text" className="w-auto" />
            <Image src="/images/new-cpr-radar-logo.svg" width={0} height={0} alt="Climate Policy Radar logo" data-cy="cpr-logo" className="w-auto" />
            <Image
              src="/images/policy-radar-text.svg"
              width={0}
              height={0}
              alt="Policy Radar"
              data-cy="cpr-logo-policy-radar-text"
              className="w-auto"
            />
          </ExternalLink>
          <br />
          <div className="justify-start">
            <span className="text-text-secondary text-base leading-normal">
              Climate Policy Radar uses AI and data science
              <br />
              to map the world's climate policies.
              <br />
              <br />
              Visit{" "}
            </span>
            <ExternalLink className="text-text-secondary text-base  underline leading-normal" url="https://www.climatepolicyradar.org">
              climatepolicyradar.org
            </ExternalLink>
          </div>
        </div>
      </main>
    </Columns>
  </div>
);
