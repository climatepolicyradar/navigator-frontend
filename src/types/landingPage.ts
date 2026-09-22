import Image from "next/image";
import { ComponentProps, ReactNode } from "react";

import { TQueryParams } from "@/constants/queryParams";

import { TFeature } from "./features";

type TImageProps = ComponentProps<typeof Image> & {
  // Prevents no width/height runtime error
  width: number;
  height: number;
};

export type TSearchSuggestion = {
  label: string;
  params: Partial<Record<TQueryParams, string>>;
  newParams: Record<string, string>;
};

export type TLandingPageSearchConfig = {
  button: TSearchSuggestion;
  suggestions: TSearchSuggestion[];
};

export type TLandingPageConfig = {
  background?: {
    classes: string;
    image: TImageProps;
  };
  hero: {
    description: string;
    taxonomy: string;
    title: string;
  };
  organisation?: {
    logoImage: TImageProps;
    links: {
      label: string;
      externalHref: string;
    }[];
  };
  search: TLandingPageSearchConfig;
  textContent: {
    title: string;
    content: ReactNode;
  }[];
  requiredFeature?: TFeature;
};
