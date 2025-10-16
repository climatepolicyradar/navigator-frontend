#!/bin/bash

###############################################################################
# Generate frontend skeleton for a new custom app, creating the required files and directories
# This script is designed to work on POSIX-compliant systems, including Linux and macOS
#
# The script will create the following files and directories:
# Tailwind theme settings (`tailwind.config.js`) - controls things like colours and default spacing within the tailwind system
# Homepage (`homepage.tsx`) - a bespoke homepage component
# Page layout (`main.tsx`) - controls the display of a standard page, including the header and footer components
# e2e tests (folder in `e2e/[theme]/`) - runs the required e2e tests. Adding a test file in this directory is required but its contents can be empty (^)
# Methodology link component (`MethodologyLink.tsx`) - controls how the behaviour of the methodology link works in the search filters. Although this file is required - its contents can be empty (^).
# Analytics (`Analytics.tsx`) - controls what (if any) analytics should be activated when the user consents to cookies. Although this file is required - its contents can be empty (^).
# Custom css styles (`styles.scss`) - controls any custom css styling, e.g. custom fonts, components with classes or IDs that need styling, this is required - so that the app actually compiles
#
#
# As well as adding the new files and directories, this script will also;
# update the ci-cd.yml file for the new theme, ensuring that ci checks can be run on the new custom app
# update the tsconfig.json file with the new theme path, creating aliases that make imports cleaner and more manageable
# update the exported theme types in the types.ts file so that the app does not fail the type check when compiling
#
# Prerequisites:
# - trunk (https://trunk.io/)
#
###############################################################################

read -r -p "Enter the name of the new custom app website (use camel-case if required): " custom_app_name

read -r -p "Input the acronym for the custom app theme (e.g. CPR, CCLW, OEP, MCF...): " theme
theme="$(tr "[:upper:]" "[:lower:]" <<<"${theme}")"

themes_path="themes"
e2e_path="e2e"

# Check if the themes directory exists
if [[ ! -d ${themes_path} ]]; then
	echo "The themes directory does not exist. Creating it now..."
	mkdir "${themes_path}"
fi

new_dir="${themes_path}/${theme}"

if [[ -d ${new_dir} ]]; then
	echo "You are trying to duplicate a Custom App, ${new_dir} already exists."
	echo "Please delete this folder and its contents and try again if you want to create a new custom app at this path"
	exit 1
fi

components_dir="${new_dir}/components"
layouts_dir="${new_dir}/layouts"
pages_dir="${new_dir}/pages"
styles_dir="${new_dir}/styles"
tests_dir="${new_dir}/tests"
e2e_test_dir="${e2e_path}/cypress/e2e/${theme}"

printf "The custom app does not exist, creating it now with the required sub-directories and files..."
mkdir -p "${new_dir}" "${components_dir}" "${layouts_dir}" "${pages_dir}" "${styles_dir}" "${tests_dir}" "${e2e_test_dir}"
printf " -> Created custom app directory for %s: %s\n\n" "${theme}" "${new_dir}"

# Define the content for relevant required files
read -r -d '' MAIN_CONTENT <<EOM

import React, { FC, ReactNode } from "react";
import Header from "@/components/headers/Main";
import Footer from "@/components/footer/Footer";

type TProps = {
  children?: ReactNode;
};

const Main: FC<TProps> = ({ children }) => (
  <>
    <Header />
    <main id="main" className="flex flex-col flex-1">
      {children}
    </main>
    <Footer />
  </>
);
export default Main;

EOM

read -r -d '' ANALYTICS_CONTENT <<EOM

import React from 'react';

const Analytics = ({enableAnalytics}: {enableAnalytics: boolean}) => {
    return null 
};

export default Analytics;

EOM

read -r -d '' HOMEPAGE_CONTENT <<EOM

import React from "react";
// generic layer component
import Layout from "@/components/layouts/LandingPage";

import Hero from "@/${theme}/components/Hero";

type TProps = {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
};

const LandingPage = ({ handleSearchInput, searchInput }: TProps) => {
  return (
    <Layout title="${custom_app_name}">
      <main id="main" className="flex flex-col flex-1">
        <div className="bg-cclw-dark">
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} />
        </div>
      </main>
    </Layout>
  );
};

export default LandingPage;

EOM

read -r -d '' E2E_TEST_PAGE_CONTENT <<EOM

/// <reference types="cypress" />


describe("Landing page", () => {
  before(() => {
    cy.visit("/");
  });

  it("should display the placeholder homepage", () => {
    cy.contains("${custom_app_name}").should("be.visible");
  });
});


EOM

# Define the content for Hero.tsx file, this component which lives on the homepage.tsx page contains our search form which powers all of the custom apps, and
# adds some custom styling so that the hero component slots nicely into the landing page and you don't have to worry about css tweaks on the initial setup
read -r -d '' HERO_CONTENT <<EOM

import LandingSearchForm from "./LandingSearchForm";


type TProps = {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
};

const Hero = ({ handleSearchInput, searchInput }: TProps) => {
  return (
    <div className="pb-6 text-white pt-[28px] sm:pt-[48px] md:pt-[80px] lg:pt-[100px] xl:pt-[140px]">
      <div className="container">
        <div className="flex flex-col items-center justify-center mb-6">
		  <p className="font-medium tracking-slight text-[18px] lg:text-[30px]" data-cy="intro-message">
          ${custom_app_name} Custom App
        </p>
        </div>
        <div className="max-w-screen-md mx-auto mt-6">
          <LandingSearchForm handleSearchInput={handleSearchInput} placeholder="Search the full text of any document" input={searchInput} />
        </div>
      </div>
    </div>
  );
};

export default Hero;

EOM

read -r -d '' METHODOLOGY_LINK_CONTENT <<EOM
const MethodologyLink = () => {
  return null;
};

export default MethodologyLink;
EOM

# Define the content for index.ts, this follows the next convention of having a single index.ts file to control and manage the imports of a component directory
read -r -d '' INDEX_TS_CONTENT <<EOM

export { default as Analytics } from "./Analytics";
export { default as Hero } from "./Hero";

EOM

touch "${components_dir}/index.ts"
touch "${components_dir}/Analytics.tsx"

echo "${ANALYTICS_CONTENT}" >"${components_dir}/Analytics.tsx"
echo "${INDEX_TS_CONTENT}" >"${components_dir}/index.ts"
cp -r "${themes_path}/cclw/components/LandingSearchForm.tsx" "${components_dir}/LandingSearchForm.tsx"
printf "%s" "${HERO_CONTENT}" >"${components_dir}/Hero.tsx"

touch "${components_dir}/MethodologyLink.tsx"
echo "${METHODOLOGY_LINK_CONTENT}" >"${components_dir}/MethodologyLink.tsx"

touch "${pages_dir}/homepage.tsx"
echo "${HOMEPAGE_CONTENT}" >"${pages_dir}/homepage.tsx"

touch "${layouts_dir}/main.tsx"
echo "${MAIN_CONTENT}" >"${layouts_dir}/main.tsx"

e2e_test_pages_dir="${e2e_test_dir}/pages"
mkdir "${e2e_test_pages_dir}"
touch "${e2e_test_pages_dir}/homepage.cy.js"
echo "${E2E_TEST_PAGE_CONTENT}" >"${e2e_test_pages_dir}/homepage.cy.js"

# Copy the tailwind.config.ts and styles.scss from the cclw theme directory
cp -r "${themes_path}/cclw/tailwind.config.js" "${new_dir}/tailwind.config.js"
printf "Copied tailwind.config.js file from %s to %s.\n\n" "${themes_path}/cclw" "${new_dir}"

cp -r "${themes_path}/cclw/styles/styles.scss" "${styles_dir}/styles.scss"
printf "Copied styles.scss file from %s to %s.\n\n" "${themes_path}/cclw" "${styles_dir}"

touch "${new_dir}/redirects.json"
echo "[]" >"${new_dir}/redirects.json"

# Update the ci-cd.yml, tsconfig.json and types.ts files accordingly
sed -e "s/theme: \[\(.*\)\]/theme: [\1, ${theme}]/" .github/workflows/ci-cd.yml >.github/workflows/ci-cd.yml.tmp && mv .github/workflows/ci-cd.yml.tmp .github/workflows/ci-cd.yml

sed -e '/"paths":/,/}/{
		/}/s/}/,\n    "@'"${theme}"'\/*": ["themes\/'"${theme}"'\/*"]\n  }/
	}' "tsconfig.json" >"temp_tsconfig.json" && mv "temp_tsconfig.json" "tsconfig.json"

sed -e "s/export type TTheme = /export type TTheme = \"${theme}\" | /" src/types/types.ts >src/types/types.ts.tmp && mv src/types/types.ts.tmp src/types/types.ts

printf "\033[1;34mNow that's done, set the environment variable by running: export THEME=%s\n \033[0m\n" "${theme}"

# Check trunk.io is installed
if ! command -v trunk &>/dev/null; then
	echo "trunk not installed. Please install trunk CLI..."
	exit 1
fi

trunk fmt
