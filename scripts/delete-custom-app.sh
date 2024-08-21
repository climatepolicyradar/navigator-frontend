#!/bin/bash

###############################################################################
# Delete a custom app
#
# This script is designed to work on POSIX-compliant systems, including Linux and macOS
#
# This script will:
# 1. Delete the theme folder from the themes directory
# 2. Delete the e2e test folder from the e2e/cypress/e2e directory
# 3. Remove the theme path from the tsconfig.json file
# 4. Remove the theme from the ci-cd.yml file
# 5. Remove the theme from the types.ts file
###############################################################################

read -r -p "Please enter the theme name of the custom app you want to delete, this is usually an acronym (e.g. CPR, CCLW, OEP, MCF...): " theme

if [[ ! -d "themes/${theme}" ]]; then
	echo "Error: Theme '${theme}' does not exist in the themes directory."
	exit 1
fi

rm -rf "themes/${theme}"
rm -rf "e2e/cypress/e2e/${theme}"

# Remove path from tsconfig.json
sed -e '/"@'"${theme}"'\/\*":[[:space:]]*\["themes\/'"${theme}"'\/\*"\],*/d' tsconfig.json >temp.json && mv temp.json tsconfig.json

# Remove theme from ci-cd.yml
awk -v theme="${theme}" '
/matrix:/ { in_matrix = 1 }
in_matrix && /theme:/ && !updated {
    gsub(/\[|\]/, "")
    split($0, parts, ":")
    gsub(theme ",|, *" theme, "", parts[2])
    $0 = parts[1] ": [" parts[2] "]"
    updated = 1
}
/^[^ ]/ { in_matrix = 0 }
{ print }
' .github/workflows/ci-cd.yml >temp.yml && mv temp.yml .github/workflows/ci-cd.yml

# Remove theme from src/types/types.ts
sed -e '/export type TTheme/s/[[:space:]]*"'"${theme}"'"[[:space:]]*|*//g' \
	-e '/export type TTheme/s/|[[:space:]]*"'"${theme}"'"[[:space:]]*//g' \
	-e '/export type TTheme/s/||*/|/g' \
	-e '/export type TTheme/s/|)/)/g' \
	src/types/types.ts >temp.ts && mv temp.ts src/types/types.ts

echo "Custom app '${theme}' has been deleted."
