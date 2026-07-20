# Project Overview

For dev setup, commands, testing, theming, and deployment see
[README.md](README.md).

This project is a web application that provides a user interface for searching
and navigating through climate-related documentation and associated metadata,
with support for various themes and configurations. The application is built
using Typescript, Next.js, React, and Tailwind CSS and deployed as a docker
container.

## UI guidelines

### General

- When generating code keep all code within the same file unless specifically
  instructed not to.

### Styling and CSS

- We use Tailwind and our file: styles/theme.css contains our theme colours. Use
  the colours and styles defined in this file. Flag to the user if there are
  styles that we need that are not defined in this file. Do not update this
  file.

### Components

- Use the appropriate Base-UI component where necessary, see here for a list of
  the common components:
  [Base UI components](https://base-ui.com/react/components)
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
- If creating any new Interfaces prefix the name of the Interface with `I`, e.g.
  `IInterfaceName`

### Utilities

- Avoid complex logic within the component - use a utility function and call
  this from within the component. Prioritise a separation of concern and
  producing modular and maintainable code.
- When generating a new utility function for a component, keep the function in
  the same file as the component. Allow the developer to move the function if
  they feel it is necessary, but this should be the default behaviour.

## Behavioral guidelines

### Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

### Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

### Goal-Driven Execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```text
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```
