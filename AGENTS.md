# Project Overview

This project is a web application that provides a user interface for searching
and navigating through climate-related documentation and associated metadata,
with support for various themes and configurations. The application is built
using Typescript, Next.js, React, and Tailwind CSS and deployed as a docker
container.

## UI guidelines

### General

- The UI should be clean and intuitive, with a focus on usability and
  accessibility.
- When generating new components, do not apply too many tailwind classes, allow
  for developer discretion.

### Types

- Always define types for component props, even if the props are simple. This
  promotes consistency and makes it easier to add additional props in the future
  if needed. Use the syntax `TProps` for component props.
- When generating types for use within components, keep the type definition in
  the same file as the component. Allow the developer to move the type
  definition if they feel it is necessary, but this should be the default
  behaviour.

### Utilities

- Avoid complex logic within the component - use a utility function and call
  this from within the component. Prioritise a separation of concern and
  producing modular and maintainable code.
- When generating a new utility function for a component, keep the function in
  the same file as the component. Allow the developer to move the function if
  they feel it is necessary, but this should be the default behaviour.
