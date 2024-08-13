# Creating Custom App

To add a new custom app, update the themes directory with
a new folder titled with the appropriate corpora alias.

You will need a few required files/folders :

- `Analytics.tsx` : controls what (if any) analytics should be activated
  when the user consents to cookies, this is required in our next configs,
  but you can set the return value to null whilst developing.
- `main.tsx` :controls the display of a standard page, including
  the header and footer components
- `redirects.json` : controls the server-side redirects,
  our `next.config.js` file configures our redirects across the site, it parses
  the array of redirects and sets them up when next is building the application.
  This file is required - this can set to return an empty array initially
- `tailwind.config.js` : controls our default configs within the tailwind system
- `homepage.tsx`: a bespoke homepage component

Update `type TTheme` to include new custom app alias

## Running Locally

Set the 'theme' to run the appropriate environment/app i.e to run the cclw app
locally update the .env file to 'THEME=cclw' or.. `THEME=cclw npm run dev`

## Update Domain

Once a new domain has been set, update the `getThemeDomain()` function
to include new custom app domain name

## Update Paths

Update paths in the `tsconfig.json` and include new theme directory
