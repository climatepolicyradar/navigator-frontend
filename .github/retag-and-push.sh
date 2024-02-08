set -e

script_folder=$(dirname "${BASH_SOURCE[0]}")
source $script_folder/funcs.sh

if [ "$#" -ne 2 ]; then
    echo "Pushes a container image to ECR with tags"
    echo
    echo "Usage: $0 project input_tag"
	@@ -15,7 +15,7 @@ if [ "$#" -ne 2 ]; then
    exit 1
fi

[ "${DOCKER_REGISTRY}" == "" ] && (echo "DOCKER_REGISTRY is not set" ; exit 1)

project="$1"
image_tag="$2"
	@@ -38,16 +38,16 @@ echo "-------------"

docker_tag() {
    echo "Re-tagging $1 -> $2"
    docker tag $1 $2
}

process_tagged_version() {
    local tag_array
    semver=$1
    get_docker_tags tag_array ${name} ${semver}

    for tag in "${tag_array[@]}" ; do
        docker_tag "${input_image}" ${tag}
        docker push "${tag}"
    done
}
	@@ -78,16 +78,16 @@ if [[ "${GITHUB_REF}" == "refs/heads"* ]]; then
        docker_tag "${input_image}" "${name}:${branch}-${short_sha}"
        docker push "${name}:${branch}-${short_sha}"
    fi
elif is_tagged_version ${GITHUB_REF} ; then
    # push `semver` tagged image
    semver="${GITHUB_REF/refs\/tags\/v/}"
    echo "Detected Tag: ${semver}"
    process_tagged_version ${semver}
else
    echo "${GITHUB_REF} is neither a branch head nor valid semver tag"
    echo "Assuming '${GITHUB_HEAD_REF}' is a branch"
    if [[ -n "${GITHUB_HEAD_REF}" ]]; then
        branch="$(echo ${GITHUB_HEAD_REF}| tr -c '[0-9,A-Z,a-z]' '-')"
        docker_tag "${input_image}" "${name}:${branch}-${timestamp}-${short_sha}"
        docker push "${name}:${branch}-${timestamp}-${short_sha}"
    else
        echo "No branch found, not a PR so not publishing."
    fi
fi
