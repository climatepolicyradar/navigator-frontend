# Serve `_next/static` from S3 + CloudFront — implementation plan

Steps use checkbox (`- [ ]`) syntax for tracking. Merged from Katy's
`2026-08-04-next-static-cdn.md` and `s3-static-assets-plan.md` in this folder.
Katy's plan supplies the diagnosis and scope; this one corrects three defects in
it (see [Appendix A](#appendix-a--corrections-against-katys-plan)) and drops one
task entirely.

## Goal

Stop production deploys generating their own 404 spikes. Next.js emits
build-specific, content-hashed assets under `_next/static/*`. When a deploy
replaces the running task, clients still on the old HTML request chunks that
only existed in the old container, and 404. Serving `_next/static/*` from S3
instead means those requests never reach ECS and keep succeeding across a
deploy.

Those 404s are what pushes ECS Express's default deployment-rollback alarm into
ALARM (it counts 4XX and divides by a per-task average). FUS-173 / PR #1446
tried to override that alarm by adopting it into Pulumi under the same name; it
didn't stick, because ECS Express manages `deploymentConfiguration.alarms`
server-side with no Pulumi-exposed field, so AWS recreates its own alarm on
every service reconciliation. Rather than migrate off `ExpressGatewayService` —
a bigger, riskier change — this removes the trigger.

## Non-goals

- **`public/` is out of scope.** Those filenames are stable across builds, so
  they still resolve from a new container and contribute nothing to the
  deploy-404 spike. Moving them is separate work; the trade-offs are in
  `s3-static-assets-plan.md`.
- **No `assetPrefix`, no separate CDN domain.** Not needed — see Appendix A.1.
- **No cache-invalidation work.** `_next/static` is content-hashed and
  immutable, so it never needs invalidating. (There _is_ a live invalidation bug
  — see [Appendix B](#appendix-b--adjacent-bug-not-in-scope) — but it's
  independent of this.)

## Tech stack

Pulumi (Python, existing `pulumi_aws`), GitHub Actions, AWS S3 + CloudFront +
IAM.

## Design decisions

| Decision           | Choice                                                                            | Why                                                                                                                                                                                                                                                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bucket granularity | One per theme per environment, deterministic name `cpr-{env}-{theme}-next-static` | Created inside the per-theme stack, so per-theme falls out naturally. A deterministic name means CI can construct it — no stack output, no manually-set repo variable to drift                                                                                                                                                         |
| Bucket naming      | `cpr-{env}-{theme}-next-static` — e.g. `cpr-production-cclw-next-static`          | Matches the org convention (`cpr-production-document-cache`, `cpr-staging-data-pipeline-cache`, `cpr-prod-cclw-document-admin-store`). `next-static` names the _exact_ contents: the `.next/static` directory, served at `/_next/static/*`. Not "static-assets" — that would imply `public/` is in here too, and it deliberately isn't |
| Environments       | staging **and** production                                                        | A mistake here breaks every page load, not just deploys. Rehearse on staging. A staging bucket costs pennies                                                                                                                                                                                                                           |
| S3 key layout      | Upload `.next/static/` → `s3://…/_next/static/`, origin has no `origin_path`      | CloudFront asks S3 for the request path verbatim, so keys must mirror the URL path. No rewrite function, no theme/SHA prefix needed — the bucket is already per-theme and filenames are content-hashed                                                                                                                                 |
| Cache policy       | AWS managed `CachingOptimized` (`658327ea-f89d-4fab-a63d-7e88639e58f6`)           | The frontend policy whitelists all query strings (fragments the cache) and `Authorization` (risks colliding with OAC's SigV4 signing). No origin request policy either — S3 needs no forwarded cookies or `Origin`                                                                                                                     |
| Lifecycle          | Expire at **30 days**, not 7                                                      | S3 expiry is by object _age_, not last access. A theme that doesn't deploy for longer than the window has its **live** build's assets deleted underneath it. 30 days plus Task 6's failover makes that survivable; 7 days is inside a Christmas freeze                                                                                 |
| Upload point       | The three deploy workflows, right after `docker build`                            | The image is built locally in each workflow, so extraction needs no pull and can't race a mutable `:latest` tag                                                                                                                                                                                                                        |
| IAM                | New per-theme inline `RolePolicy` attached to the existing role by name           | The role isn't managed by any stack (Appendix A.3). A separate inline policy avoids importing a `protect=True` role, and scopes writes to one bucket instead of `Resource: "*"`                                                                                                                                                        |

---

## Task 1: S3 bucket for static assets

Files — create: `infra/resources/next_static_bucket.py`; modify:
`infra/__main__.py`

- [ ] **Step 1: Write the component resource**

```python
"""S3 bucket holding each deploy's Next.js /_next/static output.

Objects are content-hashed by webpack, so successive builds accumulate rather
than overwrite: a client still running an old build can keep fetching its own
chunks after a newer task has replaced the container that served them.

Keys mirror the request path (`_next/static/...`) because CloudFront asks the
origin for the path verbatim. A lifecycle rule expires objects so the bucket
doesn't grow forever -- note S3 expiry is by object age, not last access, so the
window must comfortably exceed the longest expected gap between deploys.
"""

from dataclasses import dataclass
from typing import Dict, Optional

import pulumi
import pulumi_aws as aws

from resources.util import tag_name


@dataclass
class NextStaticBucketConfig:
    # Days to retain a build's assets. Must exceed the longest expected gap
    # between deploys -- expiry is by object age, so a quiet month would
    # otherwise delete the live build's assets.
    expiration_days: int = 30


class NextStaticBucket(pulumi.ComponentResource):
    """A component resource for the /_next/static asset bucket."""

    def __init__(
        self,
        name: str,
        bucket_name: str,
        config: NextStaticBucketConfig,
        tags: Optional[Dict[str, str]] = None,
        opts: Optional[pulumi.ResourceOptions] = None,
    ):
        super().__init__("pkg:index:NextStaticBucket", name, None, opts)

        default_tags = {
            "CPR-Created-By": "pulumi",
            "CPR-Pulumi-Stack-Name": pulumi.get_stack(),
            "CPR-Pulumi-Project-Name": pulumi.get_project(),
            "CPR-Tag": tag_name(),
        }
        self.tags = default_tags | (tags or {})

        self.bucket = aws.s3.Bucket(
            f"{name}-next-static",
            bucket=bucket_name,
            tags=self.tags,
            opts=pulumi.ResourceOptions.merge(
                pulumi.ResourceOptions(parent=self, protect=True),
                opts or pulumi.ResourceOptions(),
            ),
        )

        aws.s3.BucketLifecycleConfiguration(
            f"{name}-next-static-lifecycle",
            bucket=self.bucket.id,
            rules=[
                aws.s3.BucketLifecycleConfigurationRuleArgs(
                    id="expire-old-builds",
                    status="Enabled",
                    filter=aws.s3.BucketLifecycleConfigurationRuleFilterArgs(
                        prefix="",
                    ),
                    expiration=aws.s3.BucketLifecycleConfigurationRuleExpirationArgs(
                        days=config.expiration_days,
                    ),
                )
            ],
            opts=pulumi.ResourceOptions(parent=self),
        )

        self.oac = aws.cloudfront.OriginAccessControl(
            f"{name}-next-static-oac",
            origin_access_control_origin_type="s3",
            signing_behavior="always",
            signing_protocol="sigv4",
            opts=pulumi.ResourceOptions(parent=self),
        )

        self.register_outputs(
            {
                "bucket_name": self.bucket.id,
                "bucket_arn": self.bucket.arn,
                "bucket_regional_domain_name": self.bucket.bucket_regional_domain_name,
                "oac_id": self.oac.id,
            }
        )

    def allow_distribution_read(self, distribution_arn: pulumi.Input[str]) -> None:
        """Grant one CloudFront distribution read access via OAC.

        Called after the distribution exists so the policy can be conditioned on
        its ARN -- without that condition any CloudFront distribution in any
        account could read the bucket.
        """
        aws.s3.BucketPolicy(
            f"{self._name}-next-static-policy",
            bucket=self.bucket.id,
            policy=pulumi.Output.all(self.bucket.arn, distribution_arn).apply(
                lambda args: aws.iam.get_policy_document(
                    statements=[
                        aws.iam.GetPolicyDocumentStatementArgs(
                            effect="Allow",
                            principals=[
                                aws.iam.GetPolicyDocumentStatementPrincipalArgs(
                                    type="Service",
                                    identifiers=["cloudfront.amazonaws.com"],
                                )
                            ],
                            actions=["s3:GetObject"],
                            resources=[f"{args[0]}/*"],
                            conditions=[
                                aws.iam.GetPolicyDocumentStatementConditionArgs(
                                    test="StringEquals",
                                    variable="AWS:SourceArn",
                                    values=[args[1]],
                                )
                            ],
                        ),
                    ]
                ).json
            ),
            opts=pulumi.ResourceOptions(parent=self),
        )
```

- [ ] **Step 2: Wire it into `infra/__main__.py`**

Import alongside the other resource imports (near `RollbackAlarm`, ~line 27):

```python
from resources.next_static_bucket import NextStaticBucket, NextStaticBucketConfig
```

Create the bucket inside the `if not is_review_stack_or_template:` block (review
stacks skip CloudFront entirely, so they keep serving assets from the
container), before the `# Create CloudFront distribution` section:

```python
    # Serves build-specific JS/CSS so a client mid-session on an old build can
    # still fetch its chunks after a deploy replaces the container.
    next_static_bucket = None
    if env in ("staging", "production"):
        next_static_bucket = NextStaticBucket(
            f"{name_prefix}-next-static",
            bucket_name=f"cpr-{env}-{theme}-next-static",
            config=NextStaticBucketConfig(),
        )
```

- [ ] **Step 3: Preview**

```bash
cd infra && uv run pulumi preview --stack cclw-staging
```

Verify: one `aws:s3/bucket:Bucket`, one `BucketLifecycleConfiguration`, one
`cloudfront.OriginAccessControl` to add. No changes to existing resources. The
`BucketPolicy` appears in Task 2, once the distribution ARN exists.

No `DeprecationWarning` should appear in the preview output — see
[Appendix C](#appendix-c--pulumi-aws-v7-resource-naming) on why the `*V2` S3
resources must not be used here.

- [ ] **Step 4: Commit**

```bash
git add infra/resources/next_static_bucket.py infra/__main__.py
git commit -m "infra: add S3 bucket for per-build Next.js static assets"
```

---

## Task 2: CloudFront origin and cache behaviour for `/_next/static/*`

Files — modify: `infra/resources/cloudfront_distribution.py`,
`infra/__main__.py`

- [ ] **Step 1: Teach `OriginConfig` about S3 origins**

`_create_origins` (`cloudfront_distribution.py:117-140`) always emits
`custom_origin_config`, which is wrong for an S3 origin behind OAC. Add an
opt-in field rather than special-casing, so every existing HTTP-origin call site
is untouched:

```python
@dataclass
class OriginConfig:
    """Configuration for a CloudFront origin."""

    domain_name: str
    origin_id: str
    origin_path: str = ""
    custom_headers: Optional[Dict[str, str]] = None
    connection_timeout: int = 10
    read_timeout: int = 30
    keepalive_timeout: int = 5
    # Set for S3 origins accessed via Origin Access Control; mutually
    # exclusive with the custom_origin_config path used for HTTP origins.
    origin_access_control_id: Optional[str] = None
```

```python
    def _create_origins(self, origins: List[OriginConfig]) -> List[Dict[str, Any]]:
        """Create the origins configuration for CloudFront."""
        result = []
        for origin in origins:
            entry: Dict[str, Any] = {
                "domain_name": origin.domain_name,
                "origin_id": origin.origin_id,
                "origin_path": origin.origin_path,
                "custom_headers": [
                    {"header_name": name, "header_value": value}
                    for name, value in (origin.custom_headers or {}).items()
                ],
                "connection_attempts": 3,
                "connection_timeout": origin.connection_timeout,
            }
            if origin.origin_access_control_id:
                entry["origin_access_control_id"] = origin.origin_access_control_id
            else:
                entry["custom_origin_config"] = {
                    "http_port": 80,
                    "https_port": 443,
                    "origin_protocol_policy": "https-only",
                    "origin_ssl_protocols": ["TLSv1.2"],
                    "origin_read_timeout": origin.read_timeout,
                    "origin_keepalive_timeout": origin.keepalive_timeout,
                }
            result.append(entry)
        return result
```

- [ ] **Step 2: Add the origin**

After the `origins` list is built (`__main__.py:~463`):

```python
    if next_static_bucket is not None:
        origins.append(
            OriginConfig(
                origin_id="next-static",
                domain_name=cast(
                    str, next_static_bucket.bucket.bucket_regional_domain_name
                ),
                origin_access_control_id=cast(str, next_static_bucket.oac.id),
            )
        )
```

No `origin_path` — keys in the bucket already start `_next/static/`, matching
the request path.

- [ ] **Step 3: Add the ordered cache behaviour**

`ordered_cache_behaviors` is `None` at `__main__.py:465` and only populated for
`is_cpr_stack`. Restructure so the static behaviour is added for every theme.
Replace from `ordered_cache_behaviors = None` through the `is_cpr_stack` block's
`origins.append`:

```python
    # AWS managed CachingOptimized. The frontend cache policy is wrong here: it
    # keys on all query strings (fragmenting the cache) and forwards
    # Authorization, which can collide with OAC's SigV4 signing.
    CACHING_OPTIMIZED_POLICY_ID = "658327ea-f89d-4fab-a63d-7e88639e58f6"

    ordered_cache_behaviors = []
    if next_static_bucket is not None:
        ordered_cache_behaviors.append(
            {
                "allowed_methods": ["GET", "HEAD"],
                "cached_methods": ["GET", "HEAD"],
                "cache_policy_id": CACHING_OPTIMIZED_POLICY_ID,
                "compress": True,
                "path_pattern": "/_next/static/*",
                "target_origin_id": "next-static",
                "viewer_protocol_policy": "redirect-to-https",
            }
        )

    if is_cpr_stack:
        # ... existing api_cache_policy + the two /api behaviours, switched from
        # assignment to ordered_cache_behaviors.extend([...]), plus the existing
        # origins.append(OriginConfig(origin_id="api", ...)) unchanged.
        ...
```

No empty-list-to-`None` collapse is needed.
`CloudFrontDistribution._build_distribution_config` already guards with
`if ordered_cache_behaviors:` (`cloudfront_distribution.py:201-202`), and `[]`
is falsy, so an empty list and `None` produce identical config. Every staging
and production stack gets a bucket anyway, so the list is never empty in
practice.

CloudFront evaluates ordered behaviours in list order, so `/_next/static/*` must
precede any pattern that could also match it. Inserting it first satisfies that
— though the patterns here don't actually overlap, so the ordering is defensive
rather than load-bearing.

**Preserve the `origins.append(OriginConfig(origin_id="api", ...))` inside the
`is_cpr_stack` block.** If it's dropped, CPR's `/api/*` behaviours reference an
origin that isn't declared, and CloudFront rejects the config — `pulumi up`
fails rather than half-applying, but it fails late.

- [ ] **Step 4: Attach the bucket policy once the distribution exists**

After the `cf = CloudFrontDistribution(...)` call (`__main__.py:~571`):

```python
    if next_static_bucket is not None:
        next_static_bucket.allow_distribution_read(cf.distribution.arn)
```

- [ ] **Step 5: Preview both the simple and the combined case**

```bash
cd infra && uv run pulumi preview --stack cclw-staging
```

Verify: distribution updated **in place** (not replaced), one new origin, one
new ordered behaviour, new `BucketPolicy`. This is the simple case — a theme
that has no ordered behaviours today.

```bash
cd infra && uv run pulumi preview --stack cpr-staging
```

Verify: the same, **plus** the two existing `/api/*` behaviours still present
and the `api` origin still declared. CPR is the only stack where the new
behaviour coexists with existing ones, so this is the preview that proves the
`extend` restructure didn't drop anything.

- [ ] **Step 6: Commit**

```bash
git add infra/resources/cloudfront_distribution.py infra/__main__.py
git commit -m "infra: route /_next/static/* to the static assets S3 bucket"
```

---

## Task 3: IAM — let CI write to the bucket

Files — modify: `infra/__main__.py`

The deploy workflows assume `navigator-new-frontend-github-actions`
(`deploy-production.yml:39`, `deploy-staging.yml:35`). That role is **not
managed by any current stack**: its guard is
`if stack == "staging" or stack == "production"` (`__main__.py:356`) and every
stack is named `{theme}-{env}`. Editing `github_actions_role.py` and running
`pulumi up --stack cpr-production` would do nothing. The role also carries
`protect=True`, so importing it is disruptive.

Instead attach a **new inline policy** to the existing role by name — Pulumi
manages the policy, not the role, and it scopes writes to this theme's bucket
only.

- [ ] **Step 1: Add the policy next to the bucket creation**

```python
    if next_static_bucket is not None:
        # The role itself is unmanaged (its guard in this file never matches a
        # real stack name), so attach a scoped inline policy rather than
        # importing a protected role. Named per theme+env to avoid four stacks
        # fighting over one policy name.
        aws.iam.RolePolicy(
            f"{theme}-{env}-next-static-s3-write",
            role="navigator-new-frontend-github-actions",
            policy=next_static_bucket.bucket.arn.apply(
                lambda arn: json.dumps(
                    {
                        "Version": "2012-10-17",
                        "Statement": [
                            {
                                "Effect": "Allow",
                                "Action": ["s3:PutObject", "s3:DeleteObject"],
                                "Resource": f"{arn}/*",
                            },
                            {
                                "Effect": "Allow",
                                "Action": ["s3:ListBucket"],
                                "Resource": arn,
                            },
                        ],
                    }
                )
            ),
        )
```

- [ ] **Step 2: Confirm the role exists and the preview is additive**

```bash
aws iam get-role --role-name navigator-new-frontend-github-actions --query 'Role.RoleName'
cd infra && uv run pulumi preview --stack cclw-staging
```

Verify: role exists; preview adds one `aws:iam/rolePolicy:RolePolicy` and
modifies no existing IAM resource.

- [ ] **Step 3: Commit**

```bash
git add infra/__main__.py
git commit -m "infra: grant CI scoped write access to the static assets bucket"
```

---

## Task 4: Upload static assets in the deploy pipeline

Files — modify: `.github/workflows/deploy-staging.yml`,
`.github/workflows/deploy-production.yml`,
`.github/workflows/deploy-all-production.yml`

All three build the image locally as `$ECR_REGISTRY/$ECR_REPOSITORY:latest`
before pushing, so extraction needs no pull. Assets must land in S3 **before**
the ECS deploy step.

- [ ] **Step 1: Insert two steps into `deploy-staging.yml`**

Between `Build, tag, and push to ECR with 'latest' tag` and
`Deploy to ECS (staging)`:

```yaml
- name: Extract static assets from built image
  env:
    ECR_REGISTRY: ${{ secrets.DOCKER_REGISTRY }}
    ECR_REPOSITORY: navigator-frontend-${{ matrix.theme }}
  run: |
    set -euo pipefail
    CONTAINER_ID=$(docker create "$ECR_REGISTRY/$ECR_REPOSITORY:latest")
    docker cp "$CONTAINER_ID":/app/.next/static ./next-static
    docker rm "$CONTAINER_ID"

- name: Upload static assets to S3
  env:
    BUCKET_NAME: cpr-staging-${{ matrix.theme }}-next-static
  run: |
    set -euo pipefail
    # No --delete: these paths are per-build content hashes and must
    # outlive the container that shipped them. The lifecycle rule expires
    # them instead.
    aws s3 sync ./next-static "s3://${BUCKET_NAME}/_next/static/" \
      --cache-control "public,max-age=31536000,immutable"
```

- [ ] **Step 2: Apply the same two steps to the production workflows**

`deploy-production.yml` uses `${{ inputs.theme }}`; `deploy-all-production.yml`
uses `${{ matrix.theme }}`. Both set
`BUCKET_NAME: cpr-production-${{ <theme-expr> }}-next-static`.

- [ ] **Step 3: Verify locally that the extraction path is right**

```bash
docker build --build-arg THEME=cpr -t static-check .
CONTAINER_ID=$(docker create static-check)
docker cp "$CONTAINER_ID":/app/.next/static ./next-static-check
docker rm "$CONTAINER_ID"
find ./next-static-check -name '*.js' | head -3
```

Verify: paths look like `./next-static-check/chunks/*.js`, so the synced keys
become `_next/static/chunks/*.js` — matching the URL path CloudFront requests.
Then `rm -rf ./next-static-check`.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy-staging.yml \
        .github/workflows/deploy-production.yml \
        .github/workflows/deploy-all-production.yml
git commit -m "ci: upload Next.js static assets to S3 before each deploy"
```

---

## Task 5: Verify end to end on staging

Rehearse **both** staging shapes here. `cpr-staging` is the only pre-production
stack where the new behaviour coexists with the existing `/api/*` ones, and CPR
is deliberately last in the production rollout — so without this, the riskiest
code path would get the least rehearsal.

- [ ] **Step 1: Apply the simple case**

```bash
cd infra && uv run pulumi up --stack cclw-staging
```

- [ ] **Step 2: Deploy staging** — run `deploy-staging.yml`. Verify both new
      steps succeed and the ECS deploy and verification steps pass.

- [ ] **Step 3: Confirm the assets come from S3, not the container**

```bash
HOST=https://cclw.staging.climatepolicyradar.org
ASSET_PATH=$(curl -s "$HOST" | grep -o '/_next/static/[^"]*\.js' | head -1)
curl -sI "$HOST$ASSET_PATH" | grep -i "x-cache\|via\|server\|x-powered-by"
```

Verify: `200`, CloudFront `x-cache`/`via` headers present, and **no**
`x-powered-by: Next.js` — S3 doesn't send it, the container would.

- [ ] **Step 4: Confirm an old build's assets survive a redeploy** — the actual
      fix

Note `$ASSET_PATH` from Step 3, run `deploy-staging.yml` again (a no-op redeploy
is fine), then:

```bash
curl -sI "$HOST$ASSET_PATH" | head -1
```

Verify: `200`, not `404`. Before this change that request would 404 once the old
container was gone. **This is the acceptance test — if it fails, stop.**

- [ ] **Step 5: Check the whole app, not just one chunk** — load the site with
      devtools open and confirm zero failed requests. A broken key prefix shows
      up here as every chunk 404ing.

- [ ] **Step 6: Repeat Steps 1-5 for `cpr-staging`** — the combined case.
      Additionally confirm `/api/tokens` and `/api/v1/*` still work, since those
      behaviours were rewritten from an assignment to an `extend` in Task 2
      Step 3.

---

## Task 6: Origin failover (recommended before production)

Files — modify: `infra/resources/cloudfront_distribution.py`,
`infra/__main__.py`

Without this, a missed upload, a partial sync, or a lifecycle expiry during a
long deploy freeze means every page load breaks. An origin group failing
`next-static` → `frontend` on 403/404 turns each of those into a silent fallback
to the container copy, which is still in the image.

- [ ] **Step 1** Add optional `origin_groups` support to
      `CloudFrontDistribution`, with failover criteria on 403 and 404.
- [ ] **Step 2** Point the `/_next/static/*` behaviour's `target_origin_id` at
      the group.
- [ ] **Step 3** Verify: delete one object from the staging bucket, request it,
      confirm `200` served from the container rather than `404`.

If this task is dropped, keep `Dockerfile:19-20` copying assets into the image
regardless, and accept the risk explicitly.

---

## Task 7: Production rollout

**Check for console drift first.** The cclw, mcf and ccc distributions have
never had ordered behaviours written to them, so this is the first Pulumi change
to touch that part of their config in a long time. Any hand-edit made in the AWS
console since will be reverted by `pulumi up`. Per stack, before applying:

```bash
cd infra && uv run pulumi refresh --stack <stack>   # then read the diff, don't just accept
```

Also expect each `pulumi up` to take several minutes longer than usual — Pulumi
waits for each CloudFront distribution to reach `Deployed`, and stacks that
previously showed no diff now carry that wait.

While a distribution's config propagates, some edges route `/_next/static/*` to
S3 and others still to the container. Both serve identical bytes, so the window
is harmless — but only because the assets are still in the image. That's why
removing them from the `Dockerfile` is last and optional.

- [ ] **Step 1** `pulumi refresh` then `pulumi up --stack cclw-production`, then
      deploy cclw via `deploy-production.yml`. Repeat Task 5's Steps 3-5 against
      production.
- [ ] **Step 2** Watch the rollback alarm across the next 2-3 cclw deploys: no
      ALARM transitions, deploys completing first time without retries. This is
      the outcome the whole plan exists for.
- [ ] **Step 3** Only once cclw is clean: repeat for `cpr`, `mcf`, `ccc` in
      turn, or use `deploy-all-production.yml` once all three have their bucket
      applied.

CPR deliberately goes after cclw — it carries the most traffic and is the only
stack with the extra `/api/*` behaviours, so it's the worst first candidate.

---

## Rollback

Remove the `/_next/static/*` ordered cache behaviour and `pulumi up`. Traffic
returns to the container, which still has the assets. **The behaviour is the
switch** — nothing in the app or the image needs reverting.

The bucket, OAC, IAM policy, and CI upload steps are additive and harmless to
leave in place while investigating.

---

## Appendix A — corrections against Katy's plan

**A.1 — Task 3 (`assetPrefix` + `STATIC_ASSETS_CDN_URL`) is dropped entirely.**
Its premise — _"without this the CloudFront behavior in Task 2 is unreachable"_
— doesn't hold. Users already reach the app through CloudFront: the A record for
`{theme}.{env}.climatepolicyradar.org` points at the distribution
(`__main__.py:574`). Same-origin `/_next/static/*` requests therefore arrive at
the distribution and the ordered behaviour intercepts them ahead of the default.
`assetPrefix` is unnecessary.

It's also unsatisfiable as written: nothing in that plan provisions a
`STATIC_ASSETS_CDN_URL` hostname — no second distribution, certificate, or DNS
record — so setting it points assets at a name that doesn't resolve. The plan
only works with Task 3 skipped. Dropping it removes the `next.config.js` change,
the `Dockerfile` build arg, and any application-code change from this work.

Consequently that plan's rollback step ("revert `assetPrefix`") wouldn't restore
container serving either. The ordered behaviour is the lever.

**A.2 — The S3 key layout is fixed.** That plan uploads to
`s3://${BUCKET}/${THEME}/${BUILD_SHA}/`, so a chunk lands at
`cpr/<sha>/chunks/foo.js`, while CloudFront — with no `origin_path` on the
origin — asks S3 for `_next/static/chunks/foo.js`. Every asset would 404. Here
the upload target mirrors the request path instead. The theme and SHA prefixes
are also unnecessary: the bucket is already per-theme and webpack filenames are
content-hashed.

**A.3 — The IAM step is rewritten because the original is a no-op.**
`GitHubActionsRole` is only instantiated when the stack is literally named
`staging` or `production` (`__main__.py:356`), and no such stack exists — so
editing `github_actions_role.py` and running `pulumi up --stack cpr-production`
changes nothing. Task 3 above attaches a scoped inline policy to the existing
role instead. Katy's identification of _which_ role is right, though:
`navigator-new-frontend-github-actions` is what the deploy workflows assume.

**Smaller changes:** deterministic bucket name replaces the manual
`gh variable set STATIC_ASSETS_BUCKET_NAME_<THEME>` step; `CachingOptimized`
replaces reuse of the frontend cache policy; the bucket policy gains an
`AWS:SourceArn` condition; lifecycle goes 7 → 30 days; extraction uses the
locally-built image rather than `docker create` against the mutable `:latest`
tag with a possibly-unrelated `git rev-parse HEAD`; staging is included so
there's a rehearsal.

## Appendix B — adjacent bug, not in scope

Deploys currently trigger **no CloudFront invalidation at all**. The mechanism
exists in the sibling `navigator-infra` repo
(`automations/auto_cache_invalidations.py`, Lambda in
`automations/app_runner_lambda_code/index.py`) and invalidates `/*`, but its
EventBridge rule matches `source: ["aws.apprunner"]` while the frontend now runs
on ECS (`__main__.py:232`) — and its service-name template
(`f"{theme}-{environment}-frontend"`) doesn't match the ECS name either
(`f"{app}-frontend-{env}"`, `ecs_express_service.py:26-29`). Since most paths
are served `max-age=3600, immutable` (`next.config.js:44-79`), a deploy can take
an hour to reach the edge.

Irrelevant to this plan — `_next/static` is immutable and needs no invalidation
— but it should be fixed separately, and if it _is_ fixed, narrow `Paths` off
`/*` so it doesn't needlessly evict the immutable S3 entries on every deploy.
Confirm it's dead first via the `frontend-auto-invalidate` Lambda's CloudWatch
invocation count (expect zero).

Also spotted, deliberately untouched: `AppRunnerConfig` is still constructed at
`__main__.py:208` but never used, and `frontend:s3-path` is empty in every stack
file and read nowhere in `src/`.

## Appendix C — pulumi-aws v7 resource naming

**Do not use the `*V2` S3 resources.** In pulumi-aws v7 the V2 naming was
_reversed_ relative to v6, and every `*V2` S3 resource is now deprecated in
favour of its plain name. Verified against the installed provider
(`pulumi-aws 7.23.0`, `pulumi 3.226.0`) — `s3/bucket_v2.py` emits:

```text
s3.BucketV2 has been deprecated in favor of s3.Bucket
```

The full set of deprecated S3 resources in 7.23.0, each superseded by the same
name without the `V2` suffix:

`BucketV2`, `BucketAccelerateConfigurationV2`, `BucketAclV2`,
`BucketCorsConfigurationV2`, `BucketLifecycleConfigurationV2`,
`BucketLoggingV2`, `BucketObjectLockConfigurationV2`,
`BucketRequestPaymentConfigurationV2`,
`BucketServerSideEncryptionConfigurationV2`, `BucketVersioningV2`,
`BucketWebsiteConfigurationV2`.

What this plan uses, confirmed present in 7.23.0:

| Deprecated                                       | Use instead                                                                               |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `aws.s3.BucketV2`                                | `aws.s3.Bucket` (`BucketArgs` accepts `bucket`, `bucket_prefix`, `tags`, `force_destroy`) |
| `aws.s3.BucketLifecycleConfigurationV2`          | `aws.s3.BucketLifecycleConfiguration`                                                     |
| `aws.s3.BucketLifecycleConfigurationV2Rule*Args` | `aws.s3.BucketLifecycleConfigurationRuleArgs` / `…RuleFilterArgs` / `…RuleExpirationArgs` |

`aws.s3.BucketPolicy` and `aws.cloudfront.OriginAccessControl` were never
versioned and are unaffected.

**Why this trips people up:** under v6 the advice was the opposite — `BucketV2`
mapped to the modern `aws_s3_bucket` while plain `Bucket` was the legacy bespoke
resource. v7 made `Bucket` the modern resource, so v6-era examples (including
Katy's draft) reach for `BucketV2` correctly _for their time_ and wrongly for
ours. Since this bucket is new, no `aliases` or import is needed — only the
current name.

**Pre-existing usage elsewhere, flagged not changed:** `navigator-infra`'s
storybook bucket still uses `aws.s3.BucketWebsiteConfigurationV2` and carries
`aliases=[pulumi.Alias(type_="aws:s3/bucketV2:BucketV2")]`
(`navigator-infra/deploy/__main__.py:126-130`). That's a live resource with an
alias chain, so migrating it is a separate, careful job — out of scope here.
