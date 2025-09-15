import Image from "next/image";
import { ReactNode } from "react";

import { Columns } from "@/components/atoms/columns/Columns";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

interface IProps {
  heading?: string;
  subheading?: string;
  contentSide?: "left" | "right";
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}

export const Feature = ({ heading, subheading, contentSide = "left", image, imageAlt, children }: IProps) => {
  return (
    <div className="bg-white py-16">
      <SiteWidth>
        <Columns containerClasses="px-0" gridClasses="grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`${contentSide === "right" ? "lg:order-2" : ""}`}>
            {heading && (
              <Heading level={2} extraClasses="text-3xl xl:text-4xl !text-blue-600 !mb-2 !font-bold">
                {heading}
              </Heading>
            )}
            {subheading && (
              <Heading level={3} extraClasses="text-xl !text-gray-600 !mb-6 !font-semibold">
                {subheading}
              </Heading>
            )}
            {children}
          </div>
          {image && (
            <div className={`${contentSide === "right" ? "lg:order-1" : ""}`}>
              <div className="rounded-2xl border-[12px] border-gray-300 bg-gray-300 shadow-2xl">
                <Image
                  src={`/images/ccc/images/${image}`}
                  alt={imageAlt}
                  width={800}
                  height={619}
                  quality={85}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  className="rounded-xl"
                />
              </div>
            </div>
          )}
        </Columns>
      </SiteWidth>
    </div>
  );
};
