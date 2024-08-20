#!/bin/bash

# Define the content for the main.tsx file
read -r -d '' MAIN_CONTENT <<EOM

import React, { FC, ReactNode } from "react";
import Header from "@components/headers/Main";
import Footer from "@components/footer/Footer";

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

# Define the content for Analytics.tsx
read -r -d '' ANALYTICS_CONTENT <<EOM

import React from 'react';

const Analytics = ({enableAnalytics}: {enableAnalytics: boolean}) => {
    return null 
};

export default Analytics;

EOM

# Define the content for methodology.tsx
read -r -d '' METHODOLOGY_PAGE_CONTENT <<EOM

const Methodology = () => {
  return null;
};

export default Methodology;

EOM

# Define the content for homepage.tsx
read -r -d '' HOMEPAGE_CONTENT <<EOM

const LandingPage = ({}) => <h1> Hello World </h1>;

export default LandingPage;


EOM

# Define the content for the routes.json

read -r -d '' ROUTES_JSON_CONTENT <<EOM

[
  {
    "title": "Methodology",
    "path": "methodology",
    "contentPath": "methodology"
  }
]

EOM

# Prompt the user for the name of the new directory
read -r -p "Enter the name of the new custom app (use camel-case if required): " custom_app_name

# Define the path to the themes directory
themes_path="themes"

# Define the path to the e2e directory
e2e_path="e2e"

# Check if the themes directory exists
if [[ ! -d ${themes_path} ]]; then
	echo "The themes directory does not exist. Creating it now..."
	mkdir "${themes_path}"
fi

# Define the full path to the new directory
new_dir="${themes_path}/${custom_app_name}"
# Define the path to the subdirectories
components_dir="${new_dir}/components"
layouts_dir="${new_dir}/layouts"
pages_dir="${new_dir}/pages"
styles_dir="${new_dir}/styles"
tests_dir="${new_dir}/tests"
e2e_test_dir="${e2e_path}/cypress/e2e/${custom_app_name}"

# Check if the directory already exists
if [[ -d ${new_dir} ]]; then
	echo "You are trying to duplicate a Custom App, ${new_dir} already exists."
else
	printf "The custom app does not exist, creating it now with the required sub-directories and files..."
	mkdir -p "${new_dir}" "${components_dir}" "${layouts_dir}" "${pages_dir}" "${styles_dir}" "${tests_dir}" "${e2e_test_dir}"
	printf " -> Created custom app directory for %s: %s\n\n" "${custom_app_name}" "${new_dir}"

	# Create the required files
	touch "${components_dir}/index.ts"
	touch "${components_dir}/Analytics.tsx"
	echo "${ANALYTICS_CONTENT}" >"${components_dir}/Analytics.tsx"
	echo "export { default as Analytics } from './Analytics';" >"${components_dir}/index.ts"

	touch "${pages_dir}/homepage.tsx"
	touch "${pages_dir}/methodology.tsx"
	echo "${HOMEPAGE_CONTENT}" >"${pages_dir}/homepage.tsx"
	echo "${METHODOLOGY_PAGE_CONTENT}" >"${pages_dir}/methodology.tsx"

	touch "${layouts_dir}/main.tsx"
	echo "${MAIN_CONTENT}" >"${layouts_dir}/main.tsx"

	# Copy the tailwind.config.ts file from the cclw theme directory
	cp -r "${themes_path}/cpr/tailwind.config.js" "${new_dir}/tailwind.config.js"
	printf "Copied tailwind.config.js file from %s to %s.\n\n" "${themes_path}/cclw" "${new_dir}"

	# Create the redirects.json file
	touch "${new_dir}/redirects.json"
	echo "[]" >"${new_dir}/redirects.json"

	# Create the routes.json file
	touch "${new_dir}/routes.json"
	echo "${ROUTES_JSON_CONTENT}" >"${new_dir}/routes.json"

	# Create the e2e test file
	e2e_test_pages_dir="${e2e_test_dir}/pages"
	mkdir "${e2e_test_pages_dir}"
	touch "${e2e_test_pages_dir}/homepage.cy.js"

	printf "\033[1;34mNow that's done, you will need to update the e2e tests, include the new custom app in the ci-cd.yml file, the types.ts file and the tsconfig.js file.\033[0m\n\n"
	printf "\033[1;34mSet the environment variable by running : export THEME=%s\n \033[0m\n" "${custom_app_name}"
fi
