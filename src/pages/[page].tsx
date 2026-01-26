/* eslint-disable no-console */
import fs from "fs";

import { GetStaticProps, InferGetStaticPropsType } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

import { DEFAULT_FEATURE_FLAGS } from "@/constants/features";
import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { FeatureFlagsContext } from "@/context/FeatureFlagsContext";
import { ThemeContext, IProps as IThemeContextProps } from "@/context/ThemeContext";
import { TFeatureFlags, TTheme } from "@/types";
import { getAllCookies } from "@/utils/cookies";
import { getFeatureFlags } from "@/utils/featureFlags";
import { readConfigFile } from "@/utils/readConfigFile";

/*
// This is a dynamic page to generate pages based on the routes.json file
// For each theme we must define the list of routes and supply a contentPath
// The content will be statically generated at build time
*/

type TPage = {
  title: string;
  path: string;
  contentPath: string;
};

interface IProps {
  page?: TPage & {
    notFound?: boolean;
  };
}

export default function Page({ page }: InferGetStaticPropsType<typeof getStaticProps>) {
  // const [configFeatures, setConfigFeatures] = useState<TConfigFeatures>(DEFAULT_CONFIG_FEATURES);
  const [featureFlags, setFeatureFlags] = useState<TFeatureFlags>(DEFAULT_FEATURE_FLAGS);
  const [themeContext, setThemeContext] = useState<IThemeContextProps>({
    theme: process.env.THEME as TTheme,
    themeConfig: DEFAULT_THEME_CONFIG,
    loaded: false,
  });

  const loadFeatureFlags = async () => {
    const allCookies = getAllCookies();
    const retrievedFeatureFlags = getFeatureFlags(allCookies);
    setFeatureFlags(retrievedFeatureFlags);
  };

  const loadThemeConfig = async () => {
    const theme = process.env.THEME;
    const themeConfig = await readConfigFile(theme);
    setThemeContext((current) => ({ ...current, themeConfig, loaded: true }));
  };

  // TODO: once dynamic imports are no longer needed, both of these are synchronous
  useEffect(() => {
    loadFeatureFlags();
    loadThemeConfig();
  }, []);

  // TODO: fix this properly
  // Next is throwing a NEXT_REDIRECT error under the hood when attempting to navigate to a missing page at root, e.g. /missing-page
  if (!page || page.notFound) {
    console.warn("Page not found");
    return window.location.replace("/not-found");
  }

  const DynamicComponent = dynamic(
    () =>
      import(`../../themes/${process.env.THEME}/pages/${page.contentPath}`).catch((): { default: React.ComponentType } => ({ default: () => null })),
    {
      ssr: true,
    }
  );

  return (
    <ThemeContext.Provider value={themeContext}>
      <FeatureFlagsContext.Provider value={featureFlags}>
        <DynamicComponent />
      </FeatureFlagsContext.Provider>
    </ThemeContext.Provider>
  );
}

export async function getStaticPaths() {
  // Read the JSON file based on the environment variable
  const filePath = `./themes/${process.env.THEME}/routes.json`;
  let jsonData: TPage[] = [];
  try {
    jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.group("[page] getStaticPaths() catch");
    if (err instanceof Error && (err as NodeJS.ErrnoException).code === "ENOENT") {
      // Handle the case where the file does not exist
      console.error("File not found");
      console.error("at :" + filePath);
    } else {
      // Handle other readFileSync errors
      console.error("Error reading the file", err);
      console.error("at :" + filePath);
    }
    console.groupEnd();
  }

  // Use the data from the JSON file to generate dynamic paths
  const paths = jsonData.map((item) => ({
    params: { page: item.path },
  }));

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<IProps> = async (context) => {
  const currentPath = context.params?.page;

  // Read the JSON file based on the environment variable
  const filePath = `./themes/${process.env.THEME}/routes.json`;
  let jsonData: TPage[] = [];
  try {
    jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.group("[page] getStaticProps() catch");
    if (err instanceof Error && (err as NodeJS.ErrnoException).code === "ENOENT") {
      // Handle the case where the file does not exist
      console.error("File not found");
      console.error("at :" + filePath);
    } else {
      // Handle other readFileSync errors
      console.error("Error reading the file", err);
      console.error("at :" + filePath);
    }
    console.groupEnd();
  }

  // Find the specific data for the dynamic route
  const page = jsonData.find((page) => page.path === currentPath);

  // If no data is found, return not found to redirect to a 404 page
  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
    },
  };
};
