#!/bin/bash
#
# Update frontend backend_api_token with JWT validation
#
# This script is used to update the frontend backend_api_token with a JWT token.
# It validates the JWT token using the backend secret key and updates the
# frontend token in the Pulumi state if the secret key matches.
# It then creates a pull request to update the frontend token in the Pulumi
# state.
#
# This script has been tested only using Pulumi version 3 & on Linux as this is what our CI machines use.
#
# Usage: ./update_app_token.sh <environment> <stack> <token>
set -euo pipefail

# Colours for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No colour.

# Logging functions
log_info() {
	echo -e "${BLUE}ℹ️  $1${NC}" 1>&2
}

log_success() {
	echo -e "${GREEN}✅ $1${NC}" 1>&2
}

log_warning() {
	echo -e "${YELLOW}⚠️  $1${NC}" 1>&2
}

log_error() {
	echo -e "${RED}❌ $1${NC}" 1>&2
}

log_debug() {
	if [[ ${DEBUG} == "1" ]]; then
		echo -e "${YELLOW}🔍 DEBUG: $1${NC}" 1>&2
	fi
}

# Check arguments
if [[ $# -ne 3 ]]; then
	log_error "Usage: $0 <environment> <stack> <token>"
	log_info "Set DEBUG=1 to enable debug output"
	exit 1
fi

ENVIRONMENT="$1"
STACK="$2"
TOKEN="$3"

# Debug flag - can be set via DEBUG environment variable
DEBUG=${DEBUG:-0}

log_info "Starting app token update for ${STACK} in ${ENVIRONMENT}"
pulumi_version=$(pulumi version)
log_debug "Pulumi CLI version: ${pulumi_version}"
python_version=$(python3 --version)
log_debug "Python version: ${python_version}"
ROOT_DIR=$(pwd)
log_debug "Current directory: ${ROOT_DIR}"

# Check if Pulumi is logged in, and login if needed
check_pulumi_login() {
	log_info "Checking Pulumi login status..."
	if ! pulumi whoami >/dev/null 2>&1; then
		log_info "Pulumi not logged in, attempting to login..."
		if [[ -n ${PULUMI_ACCESS_TOKEN-} ]]; then
			pulumi login --cloud-url https://api.pulumi.com || {
				log_error "Failed to login to Pulumi with access token"
				exit 1
			}
			log_success "Logged into Pulumi successfully"
		else
			log_error "PULUMI_ACCESS_TOKEN environment variable not set"
			log_info "Please set PULUMI_ACCESS_TOKEN or run 'pulumi login' manually"
			exit 1
		fi
	else
		log_success "Pulumi already logged in"
	fi
}

check_pulumi_login

get_backend_secret_key() {
	local env="$1"
	log_info "Retrieving backend token secret key..."

	local backend_stack="climatepolicyradar/backend/${env}"
	log_debug "Attempting to select backend stack: ${backend_stack}"
	log_debug "ROOT_DIR: ${ROOT_DIR}"
	log_debug "Backend directory: ${ROOT_DIR}/backend"

	cd "${ROOT_DIR}/backend"
	current_dir=$(pwd)
	if [[ ${current_dir} != "${ROOT_DIR}/backend" ]]; then
		log_error "Failed to change into backend directory"
		return 1
	fi
	log_success "Successfully cd to backend directory"

	# Select backend stack with more verbose output
	log_debug "Running: pulumi stack select ${backend_stack}"
	pulumi stack select "${backend_stack}" 2>&1 || {
		log_error "Failed to select backend stack: ${backend_stack}"
		log_debug "Available stacks:"
		pulumi stack ls 2>&1 || log_debug "Could not list stacks"
		return 1
	}
	log_success "Selected backend stack: ${backend_stack}"

	# Get secret key.
	local secret_key
	log_debug "Attempting to retrieve backend:backend_token_secret_key"
	log_debug "Running: pulumi config get backend:backend_token_secret_key"

	# Capture both stdout and stderr - use --show-secrets to get the actual value
	secret_key=$(pulumi config get backend:backend_token_secret_key 2>/dev/null)
	local exit_code=$?

	log_debug "Pulumi config get exit code: ${exit_code}"
	log_debug "Secret key retrieved (length: ${#secret_key} characters)"

	if [[ ${exit_code} -ne 0 ]]; then
		log_error "Failed to retrieve backend secret key"
		log_debug "Error output: ${secret_key}"
		log_debug "Available config keys:"
		pulumi config 2>&1 || log_debug "Could not list config"
		return 1
	fi

	if [[ -z ${secret_key} ]]; then
		log_error "Empty secret key retrieved"
		return 1
	fi

	log_success "Successfully retrieved backend token secret key"
	echo "${secret_key}"
}

validate_jwt_token() {
	local token="$1"
	local secret_key="$2"

	log_info "Validating JWT token..."
	log_debug "Token length: ${#token} characters"

	# Create temporary Python script for JWT validation.
	# This saves bloating the YAML file with python dependencies.
	local temp_script
	temp_script=$(mktemp)
	log_debug "Created temp script: ${temp_script}"

	# Debug info without exposing secrets
	log_debug "Token length: ${#token} characters"
	log_debug "Secret key length: ${#secret_key} characters"

	cat >"${temp_script}" <<'EOF'
import sys
import jwt
import json

def get_expected_audience(environment, subject):
    """Get expected audience based on environment and subject."""
    subject_lower = subject.lower()
    
    staging_audiences = {
        "cpr": "cpr.staging.climatepolicyradar.org",
        "cclw": "cclw.staging.climatepolicyradar.org", 
        "mcf": "mcf.staging.climatepolicyradar.org",
        "ccc": "ccc.staging.climatepolicyradar.org"
    }
    
    production_audiences = {
        "cpr": "app.climatepolicyradar.org",
        "cclw": "climate-laws.org",
        "mcf": "climateprojectexplorer.org", 
        "ccc": "www.climatecasechart.com"
    }
    
    if environment == "staging":
        return staging_audiences.get(subject_lower)
    elif environment == "production":
        return production_audiences.get(subject_lower)
    return None

try:
    token = sys.argv[1]
    secret_key = sys.argv[2]
    environment = sys.argv[3]
    
    # First pass: decode without audience verification to get subject
	# And verify that the token is valid & uses the correct secret key.
    payload_no_aud = jwt.decode(token, secret_key, algorithms=["HS256"], options={"verify_aud": False})
    subject = payload_no_aud.get("sub", "")
    
    if not subject:
        print("No subject found in token", file=sys.stderr)
        sys.exit(1)
    
    # Get expected audience for this subject/environment
    expected_audience = get_expected_audience(environment, subject)
    if not expected_audience:
        print(f"No expected audience found for theme '{subject}' in environment '{environment}'", file=sys.stderr)
        sys.exit(1)
    
    # Second pass: decode with full verification including audience
    payload = jwt.decode(token, secret_key, algorithms=["HS256"], audience=expected_audience)
    print(json.dumps(payload, indent=2))
    sys.exit(0)
    
except jwt.ExpiredSignatureError:
    print("JWT token has expired", file=sys.stderr)
    sys.exit(1)
except jwt.InvalidAudienceError:
    print(f"Invalid audience: expected {expected_audience}, got {payload_no_aud.get('aud', 'none')}", file=sys.stderr)
    sys.exit(1)
except jwt.InvalidTokenError as e:
    print(f"Invalid JWT token: {e}", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"JWT validation error: {e}", file=sys.stderr)
    sys.exit(1)
EOF

	# Run validation, capture stdout only; stderr is for errors
	local validation_output
	if validation_output=$(python3 "${temp_script}" "${token}" "${secret_key}" "${ENVIRONMENT}" 2>"${temp_script}.err"); then
		log_success "JWT token validation successful"
		log_info "Token payload: ${validation_output}"
	else
		log_error "JWT token validation failed"
		if [[ -s "${temp_script}.err" ]]; then
			error_output=$(cat "${temp_script}.err")
			log_debug "Validation error: ${error_output}"
		fi
		rm -f "${temp_script}" "${temp_script}.err"
		return 1
	fi

	# Clean up our temporary script.
	rm -f "${temp_script}" "${temp_script}.err"
}

update_frontend_token() {
	local stack="$1"
	local token="$2"

	log_info "Updating frontend token for stack: ${stack}"
	log_debug "Full stack name: climatepolicyradar/${stack}"
	cd "${ROOT_DIR}/frontend"

	# Select frontend stack.
	if ! pulumi stack select "climatepolicyradar/${stack}" 2>&1; then
		log_error "Failed to select frontend stack: ${stack}"
		log_debug "Available stacks:"
		pulumi stack ls 2>&1 || log_debug "Could not list stacks"
		exit 1
	fi
	log_success "Selected frontend stack: ${stack}"

	# Update token in Pulumi state
	log_debug "Setting frontend:backend_api_token"
	if ! pulumi config set --secret frontend:backend_api_token "${token}" 2>&1; then
		log_error "Failed to update frontend token in Pulumi state"
		exit 1
	fi
	log_success "Successfully updated frontend backend_api_token in Pulumi state"
}

create_pull_request() {
	local environment="$1"
	local stack="$2"
	local branch_name="$3"

	log_info "Creating pull request..."

	# Add and commit changes.
	if ! git add . 2>&1; then
		log_error "Failed to add changes"
		exit 1
	fi

	local commit_message="Update app token for ${stack} in ${environment}"
	if ! git commit -m "${commit_message}" 2>&1; then
		log_error "Failed to commit changes"
		exit 1
	fi
	log_success "Committed changes"

	# Push branch.
	if ! git push origin "${branch_name}" 2>&1; then
		log_error "Failed to push branch to origin"
		exit 1
	fi
	log_success "Pushed branch to origin"

	# Create PR using GitHub CLI.
	local pr_title="Update app token for ${stack} (${environment})"
	local pr_body="## App Token Update

- **Environment**: ${environment}
- **Stack**: ${stack}
- **Token**: JWT token validated and updated

This PR updates the \`frontend:backend_api_token\` configuration for the specified stack.
The JWT token has been validated using the backend's secret key (AWS environment specific)."

	if ! gh pr create --title "${pr_title}" --body "${pr_body}" --base main 2>&1; then
		log_error "Failed to create pull request"
		exit 1
	fi
	log_success "Pull request created successfully"
}

main() {
	log_info "=== STARTING MAIN EXECUTION ==="

	local secret_key
	secret_key=$(get_backend_secret_key "${ENVIRONMENT}")
	if [[ -z ${secret_key} ]]; then
		log_error "Failed to get backend secret key - aborting"
		return 1
	fi
	log_success "Got secret key (length: ${#secret_key} characters)"

	validate_jwt_token "${TOKEN}" "${secret_key}"

	# Create branch name.
	local branch_name="update-app-token-${STACK//\//-}"
	log_debug "Branch name: ${branch_name}"

	# Create branch if it doesn't exist, or switch to existing branch
	if git show-ref --verify --quiet refs/heads/"${branch_name}"; then
		log_info "Branch ${branch_name} already exists, switching to it"
		git checkout "${branch_name}" || {
			log_error "Failed to checkout existing branch: ${branch_name}"
			exit 1
		}
		log_success "Switched to existing branch: ${branch_name}"
	else
		log_info "Creating new branch: ${branch_name}"
		git checkout -b "${branch_name}" || {
			log_error "Failed to create branch: ${branch_name}"
			exit 1
		}
		log_success "Created new branch: ${branch_name}"
	fi

	update_frontend_token "${STACK}" "${TOKEN}"

	create_pull_request "${ENVIRONMENT}" "${STACK}" "${branch_name}"

	log_success "App token update completed successfully!"
}

main "$@"
