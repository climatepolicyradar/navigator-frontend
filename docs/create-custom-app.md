# Creating Custom App

To add a new custom app, update the themes directory with a new folder titled
with the appropriate corpora alias.

You will need a few required files/folders:

- `themes/{custom_theme}/components/Analytics.tsx`: controls what (if any)
  analytics should be activated when the user consents to cookies, this is
  required in our next configs, but you can set the return value to null whilst
  developing.
- `themes/{custom_theme}/layouts/main.tsx`: controls the display of a standard
  page, including the header and footer components
- `themes/{custom_theme}/redirects.json`: controls the server-side redirects, our
  `next.config.js` file configures our redirects across the site, it parses the
  array of redirects and sets them up when next is building the application. This
  file is required - this can set to return an empty array initially
- `themes/{custom_theme}/tailwind.config.js`: controls our default configs within
  the tailwind system
- `themes/{custom_theme}/styles.scss`: controls any custom css styling, e.g.
  custom fonts, components with classes or IDs that need styling, this is
  required - so that the app actually compiles
- `themes/{custom_theme}/pages/homepage.tsx`: a bespoke homepage component
- `themes/{custom_theme}/components/MethodologyLink.tsx`: controls how the
  behaviour of the methodology link works in the search filters
- `e2e/cypress/e2e/{custom_theme}` - runs the required e2e tests, adding a test
  file in this directory is required but its contents can be empty
- `.env` : controls the environment variables for the custom app, for example
  the URL of the API we want the app to use

These files are optional, but recommended:

- Custom pages (`themes/{custom_theme}/routes.json` + corresponding
  `themes/{custom_theme}/pages/[page].tsx` page component) - controls which
  custom pages appear within the app
- Redirects (`themes/{custom_theme}/redirects.json`) - controls which server-side
  redirects to use, for example if our routing is different to the previous site
- Favicon (`public/images/{custom_theme}/[theme].png`) - controls the small
  icon/logo that appears within the browser

## Code to update

Add the new custom theme to the exported theme types in `types/theme.ts`:
`export type TTheme = 'cclw' | 'custom_theme'`
Add the new custom theme to the `ci-cd.yml` file:
`themes: [...themes, 'custom_theme']`
Add the theme path to the `tsconfig.json` file:
`paths: { "@themes/{custom_theme}": ["themes/{custom_theme}"] }`

## Running Locally

Set the 'theme' to run the appropriate environment/app i.e to run the cclw app
locally update the .env file to 'THEME=cclw' or.. `THEME=cclw npm run dev`

## Update Domain

Once a new domain has been set, update the `getThemeDomain()` function to include
new custom app domain name

## Custom scripts

We have a custom script that generates the required files and directories for a
new custom app, run the following command to generate the new custom app:

`make build-custom-app`

We also have a custom script that deletes a custom app, run the following command
to delete the custom app:

`make delete-custom-app`
