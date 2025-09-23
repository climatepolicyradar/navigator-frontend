import Image from "next/image";
import { ReactNode } from "react";

import { Heading } from "@/components/typography/Heading";

import { Card } from "./Card";

interface IProps {
  heading?: string;
  subheading?: string;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}

export const Feature = ({ heading, subheading, image, imageAlt, children }: IProps) => {
  return (
    <Card
      heading={heading || ""}
      extraClasses="h-full w-full"
      headingClasses="text-text-brand-darker text-2xl font-bold"
      paddingClasses="p-4 md:p-6 lg:p-10"
    >
      {subheading && (
        <Heading level={3} extraClasses="!text-2xl !text-text-tertiary !-mt-2 !mb-6 !font-bold">
          {subheading}
        </Heading>
      )}
      {children}
      {image && (
        <div>
          <Image src={`/images/ccc/${image}`} alt={imageAlt} width={800} height={619} className="rounded-lg" />
        </div>
      )}
    </Card>
  );
};
