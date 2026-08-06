# Grafana Dashboards

`waf-bots.json` is a Grafana dashboard for bot traffic through the frontend
WAFs, built from `AWS/WAFV2` CloudWatch metrics. Push it with the command below;
`uid` is `waf-bot-monitoring`.

NOTE: this isn't set to sync with Grafana. Edits made in the UI do not come back
here, so re-export and overwrite the JSON or the two drift apart.

## About

Metrics come from the WebACLs in [`resources/waf.py`](../resources/waf.py).
Production only, since Bot Control is production-gated.

The datasource is the CloudWatch one for the **production** account, named
`Prod-CloudWatch` in Grafana. The other three CloudWatch datasources point at
other accounts and will return nothing.

Its uid is not committed here: the JSON carries a `__CLOUDWATCH_DS_UID__`
placeholder that is substituted at push time, so this public repo holds no
environment identifiers.

Per-theme panels name all four WebACLs. Estate-wide panels use
`SUM(SEARCH(...))` to aggregate across them, since there is no WebACL-less
aggregate metric.

Each panel carries its own description in the JSON.

## Panels

**By theme** — four small bot-share charts (one per theme), plus all-requests
and bot-requests counts with a line per theme.

**What kind of bots (all themes combined)** — category, verified vs unverified,
top bot names, detection signals, and the Chrome/125 rule.

Bot share is a CloudWatch math expression, `bot / all * 100`. It is split one
theme per panel deliberately: all four in a single panel means 12 queries in one
`GetMetricData` request, which failed roughly 1 in 5. Three queries succeeded
8/8. Each panel still sends two hidden input series (`_all`, `_bot`) that a
field override hides from the graph.

## Caveats

1. **Bot share falls when total traffic spikes.** The denominator is all
   traffic, so an unrelated surge drops the percentage without bot traffic
   changing at all. mcf had a ~5M-request non-bot spike on 2026-07-30 to 08-01
   that made its share read 3-9% instead of its usual 62-67%. Check the
   request-count panels before drawing a conclusion from a share panel.
2. **Data starts 2026-07-22**, when the bot rule reached production. Earlier
   ranges understate bot share: the denominator is present throughout, the
   numerator is not.
3. **The denominator assumes nothing blocks.** `AllowedRequests{Rule=ALL}`
   equals total traffic only because the default action is allow and Bot Control
   is override-to-count. **If a blocking rule is added to `waf.py`, this must
   become `AllowedRequests{Rule=ALL} + BlockedRequests{Rule=ALL}`** or every
   share figure here silently becomes wrong.
4. **Expression panels fail intermittently**, around 1 in 22 loads, with a
   CloudWatch `GetMetricData` error. It is server-side, not a fault in this
   JSON; a refresh clears it, and it only ever affects one small share panel.
5. **Top bot names is a fixed list.** CloudWatch `SEARCH` cannot rank
   server-side, and wildcarding all ~90 names across four WebACLs returns ~200
   series. Add names to `BOT_NAMES` as needed.

`SampleAllowedRequest` metrics look useful but are **sampled**, not absolute.
Deliberately unused here; don't add them as counts.

## Not included

Request paths and client IPs. There is no URI dimension in `AWS/WAFV2`, so the
dashboard can show how much traffic is classified as bot but not which paths
those requests hit. Adding it needs CloudWatch Logs Insights against the
`aws-waf-logs-*` groups, and the datasource role currently lacks
`logs:StartQuery`. The same queries run ad-hoc via the AWS CLI meanwhile.

Country and device breakdowns were dropped: those dimensions cover **all**
traffic, not bots, which made them misleading on a bot dashboard.

## Pushing a change

Needs a Grafana service account token with the Editor role, created under
**Administration -> Users and access -> Service accounts**. Keep it outside this
repo and set an expiry:

```sh
echo 'YOUR_TOKEN' > ~/.grafana-token && chmod 600 ~/.grafana-token
```

Then find the datasource and folder uids. They are deliberately not committed:

```sh
GRAFANA=https://<our-org>.grafana.net
AUTH="Authorization: Bearer $(cat ~/.grafana-token)"

curl -s -H "$AUTH" $GRAFANA/api/datasources \
  | python3 -c 'import json,sys; [print(d["uid"], d["name"]) for d in json.load(sys.stdin) if d["type"]=="cloudwatch"]'

curl -s -H "$AUTH" "$GRAFANA/api/search?type=dash-folder&limit=100" \
  | python3 -c 'import json,sys; [print(f["uid"], f["title"]) for f in json.load(sys.stdin)]'
```

Take the uid of the production CloudWatch datasource, and the folder uid for
`Services/Navigator/Production` (or `Services/WIP` to test first). The dashboard
URL is keyed on its own uid, so moving between folders breaks no links.

```sh
DS_UID=<production cloudwatch datasource uid>
FOLDER=<target folder uid>

curl -s -X POST $GRAFANA/api/dashboards/db -H "$AUTH" \
  -H 'Content-Type: application/json' \
  -d @- <<< "$(DS_UID=$DS_UID FOLDER=$FOLDER python3 -c '
import json, os
raw = open("infra/dashboards/waf-bots.json").read()
d = json.loads(raw.replace("__CLOUDWATCH_DS_UID__", os.environ["DS_UID"]))
d.pop("id", None)
print(json.dumps({"dashboard": d, "folderUid": os.environ["FOLDER"], "overwrite": True}))
')"
```

`overwrite: True` also discards any UI edits made since the last push, so only
ever push from this file.

Importing the JSON through the Grafana UI instead will not work until the
placeholder is replaced.

Going the other way, a dashboard exported from the Grafana UI contains the real
datasource uid. Put the placeholder back before committing:

```sh
sed -i '' "s/$DS_UID/__CLOUDWATCH_DS_UID__/g" infra/dashboards/waf-bots.json
```

## If a panel returns zeros

Two silent failures, both of which give zeros rather than an error: a template
variable in a CloudWatch dimension value (Grafana doesn't interpolate them
there, so WebACL names are written out), or a target missing
`region: us-east-1`.
