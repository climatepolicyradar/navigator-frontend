# Project Overview

This project is a web application that serves as the front-end for the `navigator` system. It provides a user interface for searching and navigating through data, with support for various themes and configurations. The application is built using Next.js, React, and Tailwind CSS, and is designed to be run in a Docker container for ease of deployment and development.

The core functions of the application is to allow users to perform searches of documentation broadly related to climate change. Other key features are the presentation of the relationships between documents and to visually present relevant passages of text within the documents to the user based upon their search.

## Folder Structure

- `/src`: Contains the source code for the frontend.
- '/themes': Contains specific files relating to each of the themes, this includes components, pages, constants and redirects
- '/tests': Contains test files for the application.

## Libraries and Frameworks

- Typescript for type safety and improved developer experience.
- Next, React and Tailwind CSS for the frontend.
- Playwright for end-to-end testing.
- Vitest for unit testing.
- Trunk.io for code quality and formatting.

## UI guidelines

### General

- The UI should be clean and intuitive, with a focus on usability and accessibility.
- When generating new components, do not apply too many tailwind classes, allow for developer discretion.

### Types

- Always define types for component props, even if the props are simple. This promotes consistency and makes it easier to add additional props in the future if needed. Use the syntax `TProps` for component props.
- When generating types for use within components, keep the type definition in the same file as the component. Allow the developer to move the type definition if they feel it is necessary, but this should be the default behaviour.

### Utilities

- Avoid bloating components with too much logic - use a utility function if the logic is complex or if it can be reused across multiple components. This promotes separation of concerns and makes the code easier to maintain.
- When generating a new utility function for a component, keep the function in the same file as the component. Allow the developer to move the function if they feel it is necessary, but this should be the default behaviour.
