/* eslint-disable no-console */
import fs from "fs";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

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

type TProps = {
  page?: TPage & {
    notFound?: boolean;
  };
};

export default function Page({ page }: TProps) {
  // TODO: fix this properly
  // Next is throwing a NEXT_REDIRECT error under the hood when attemping to navigate to a missing page at root, e.g. /missing-page
  if (!page || page.notFound) {
    return window.location.replace("/not-found");
  }

  const DynamicComponent = dynamic(() => import(`../../themes/${process.env.BUILDTIME_TEST}/pages/${page.contentPath}`).catch(() => () => null), {
    ssr: true,
  });

  return <DynamicComponent />;
}

export async function getStaticPaths() {
  // Read the JSON file based on the environment variable
  const filePath = `./themes/${process.env.BUILDTIME_TEST}/routes.json`;
  let jsonData: TPage[] = [];
  try {
    jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.group("[page] getStaticPaths() catch");
    if (err.code === "ENOENT") {
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

export async function getStaticProps({ params }) {
  const currentPath = params.page;

  // Read the JSON file based on the environment variable
  const filePath = `./themes/${process.env.BUILDTIME_TEST}/routes.json`;
  let jsonData: TPage[] = [];
  try {
    jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.group("[page] getStaticProps() catch");
    if (err.code === "ENOENT") {
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
}
