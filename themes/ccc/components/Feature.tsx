import Image from "next/image";
import { ReactNode } from "react";

import { Columns } from "@/components/atoms/columns/Columns";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

import { Card } from "./Card";

interface IProps {
  heading?: string;
  subheading?: string;
  contentSide?: "left" | "right";
  image?: string;
  imageAlt?: string;
  inline?: boolean;
  children?: ReactNode;
}

export const Feature = ({ heading, subheading, contentSide = "left", image, imageAlt, inline = false, children }: IProps) => {
  const cardContent = (
    <>
      {subheading && (
        // Because this component uses the Card component, we need to override the heading style in order to get the look we want
        <Heading level={3} extraClasses="!text-2xl !text-text-tertiary !-mt-2 !mb-6 !font-bold">
          {subheading}
        </Heading>
      )}
      {children}
    </>
  );

  if (inline) {
    return (
      <Card
        heading={heading || ""}
        extraClasses="h-full w-full"
        headingClasses="text-text-brand-darker text-2xl font-bold"
        paddingClasses="py-11 px-11"
      >
        {cardContent}
      </Card>
    );
  }

  return (
    <div className="py-16 text-text-primary">
      <SiteWidth>
        <Columns containerClasses="px-0" gridClasses="grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`${contentSide === "right" ? "lg:order-2" : ""}`}>
            <Card
              heading={heading || ""}
              extraClasses="h-full"
              headingClasses="text-text-brand-darker text-2xl font-bold"
              paddingClasses="py-8 px-16"
            >
              {cardContent}
            </Card>
          </div>
          {image && (
            <div className={`${contentSide === "right" ? "lg:order-1" : ""}`}>
              <Image
                src={`/images/ccc/images/${image}`}
                alt={imageAlt}
                width={800}
                height={619}
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                className="rounded-2xl border-[12px] border-gray-300 bg-gray-300 shadow-2xl"
              />
            </div>
          )}
        </Columns>
      </SiteWidth>
    </div>
  );
};
