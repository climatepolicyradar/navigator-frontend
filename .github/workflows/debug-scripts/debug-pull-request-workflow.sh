#!/bin/bash

# Test script for pull_request workflow using act

set -euo pipefail

# Colours for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Colour

# Logging functions
log_info() {
	echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
	echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
	echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
	echo -e "${RED}❌ $1${NC}"
}

# Check if act is installed
check_act() {
	if ! command -v act &>/dev/null; then
		log_error "act is not installed. Please install it first:"
		echo "  brew install act (macOS)"
		echo "  or visit: https://github.com/nektos/act"
		exit 1
	fi
	log_success "act is installed"
}

# Create minimal .env file if it doesn't exist
create_env_file() {
	if [[ ! -f .env ]]; then
		log_info "Creating minimal .env file..."
		cat >.env <<EOF
# Minimal environment for testing
THEME=cpr
NODE_ENV=test
BACKEND_API_URL=http://localhost:8000
BACKEND_API_TOKEN=test-token
CONCEPTS_API_URL=http://localhost:8001
TARGETS_URL=http://localhost:8002
ROBOTS=true
EOF
		log_success "Created .env file"
	else
		log_info ".env file already exists"
	fi
}

# Test individual jobs
test_job() {
	local job_name="$1"
	local description="$2"

	log_info "Testing job: ${job_name} - ${description}"

	# shellcheck disable=SC2310
	if act pull_request --workflows .github/workflows/pull_request.yml --job "${job_name}" --list; then
		log_success "Job ${job_name} can be executed"
	else
		log_error "Job ${job_name} failed to list"
		return 1
	fi
}

# Test all jobs in sequence
test_all_jobs() {
	log_info "Testing all pull_request jobs..."

	local jobs=(
		"size:Bundle size check"
		"lhci-desktop:Lighthouse Desktop tests"
		"lhci-mobile:Lighthouse Mobile tests"
		"percy:Visual regression tests"
		"code-quality:Code quality checks"
		"test:Unit tests"
		"test-e2e:End-to-end tests"
	)

	local failed_jobs=()

	for job_info in "${jobs[@]}"; do
		IFS=':' read -r job_name description <<<"${job_info}"

		# shellcheck disable=SC2310
		if test_job "${job_name}" "${description}"; then
			log_success "Job ${job_name} passed listing test"
		else
			log_error "Job ${job_name} failed listing test"
			failed_jobs+=("${job_name}")
		fi
	done

	if [[ ${#failed_jobs[@]} -eq 0 ]]; then
		log_success "All jobs can be listed successfully"
	else
		log_warning "Failed jobs: ${failed_jobs[*]}"
	fi
}

# Test specific job with full execution
test_job_execution() {
	local job_name="$1"

	log_info "Executing job: ${job_name}"

	# Use dry-run first to see what would happen
	log_info "Dry run for ${job_name}:"
	act pull_request --workflows .github/workflows/pull_request.yml --job "${job_name}" --dryrun

	echo
	read -r -p "Execute job ${job_name}? (y/N): " -n 1
	echo

	if [[ ${REPLY} =~ ^[Yy]$ ]]; then
		log_info "Executing ${job_name}..."
		act pull_request --workflows .github/workflows/pull_request.yml --job "${job_name}"
	else
		log_info "Skipped execution of ${job_name}"
	fi
}

# Main menu
show_menu() {
	echo
	echo "🧪 Pull Request Workflow Test Menu"
	echo "=================================="
	echo "1. Test all jobs (list only)"
	echo "2. Test size job"
	echo "3. Test lhci-desktop job"
	echo "4. Test lhci-mobile job"
	echo "5. Test percy job"
	echo "6. Test code-quality job"
	echo "7. Test test job"
	echo "8. Test test-e2e job"
	echo "9. Test specific job (custom)"
	echo "0. Exit"
	echo
}

# Main execution
main() {
	log_info "Starting pull request workflow testing..."

	check_act
	create_env_file

	while true; do
		show_menu
		read -r -p "Select an option: " -n 1 -r
		echo

		case ${REPLY} in
		1)
			test_all_jobs
			;;
		2)
			test_job_execution "size"
			;;
		3)
			test_job_execution "lhci-desktop"
			;;
		4)
			test_job_execution "lhci-mobile"
			;;
		5)
			test_job_execution "percy"
			;;
		6)
			test_job_execution "code-quality"
			;;
		7)
			test_job_execution "test"
			;;
		8)
			test_job_execution "test-e2e"
			;;
		9)
			read -r -p "Enter job name: " job_name
			test_job_execution "${job_name}"
			;;
		0)
			log_info "Exiting..."
			exit 0
			;;
		*)
			log_error "Invalid option"
			;;
		esac

		echo
		read -r -p "Press Enter to continue..."
	done
}

# Run main function
main "$@"
