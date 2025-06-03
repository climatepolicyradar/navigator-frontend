import Image from "next/image";
import { ReactNode } from "react";

import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

interface IProps {
  heading?: string;
  contentSide?: "left" | "right";
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}

export const Feature = ({ heading, contentSide = "left", image, imageAlt, children }: IProps) => {
  return (
    <div className="bg-cclw-dark text-white py-12">
      <SiteWidth extraClasses="md:flex gap-8">
        <div className={`basis-1/2 ${contentSide === "right" ? "order-last" : ""}`}>
          {heading && (
            <Heading level={2} extraClasses="text-3xl xl:text-4xl xl:leading-[52px] !text-white">
              {heading}
            </Heading>
          )}
          {children}
        </div>
        {image && (
          <div className="mt-8 basis-1/2 rounded-2xl border-[12px] border-gray-300 bg-gray-300 shadow-2xl self-start md:mt-0">
            <div>
              <Image
                src={`/images/cclw/images/${image}`}
                alt={imageAlt}
                width={800}
                height={619}
                quality={85}
                sizes="(max-width: 768px) 0, (max-width: 1024px) 352, (max-width: 1536px) 50vw"
                className="rounded-xl"
              />
            </div>
          </div>
        )}
      </SiteWidth>
    </div>
  );
};
