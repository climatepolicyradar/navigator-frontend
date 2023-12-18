import fs from "fs";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

type TProps = {
  page: {
    title: string;
    path: string;
    contentPath: string;
  };
};

export default function Page({ page }: TProps) {
  const DynamicComponent = dynamic(() => import(`../../themes/${process.env.BUILDTIME_TEST}/pages/${page.contentPath}`).catch(() => () => null), {
    ssr: true,
  });

  return (
    <>
      <h1>{page.title}</h1>
      <DynamicComponent />
    </>
  );
}

export async function getStaticPaths() {
  // Read the JSON file based on the environment variable
  const filePath = `./themes/${process.env.BUILDTIME_TEST}/routes.json`;
  let jsonData = [];
  try {
    jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    if (err.code === "ENOENT") {
      // Handle the case where the file does not exist
      console.error("File not found");
      console.error("at :" + filePath);
    } else {
      // Handle other readFileSync errors
      console.error("Error reading the file", err);
      console.error("at :" + filePath);
    }
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
  let jsonData = [];
  try {
    jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    if (err.code === "ENOENT") {
      // Handle the case where the file does not exist
      console.error("File not found");
      console.error("at :" + filePath);
    } else {
      // Handle other readFileSync errors
      console.error("Error reading the file", err);
      console.error("at :" + filePath);
    }
  }

  // Find the specific data for the dynamic route
  const page = jsonData.find((page) => page.path === currentPath) || { notfound: true };

  return {
    props: {
      page,
    },
  };
}
