# Grafana Dashboards

`waf-bots.json` is a Grafana dashboard for bot traffic through the frontend
WAFs, built from `AWS/WAFV2` CloudWatch metrics. Push it with the command below;
`uid` is `waf-bot-monitoring`.

NOTE: this isn't set to sync with Grafana. Edits made in the UI do not come back
here, so re-export and overwrite the JSON or the two drift apart.

## About

Metrics come from the WebACLs in [`resources/waf.py`](../resources/waf.py).
Production only, since Bot Control is production-gated.

The datasource is hardcoded to **`Prod-CloudWatch`** (uid `2A7dsDK4k`), which
assumes `MonitorReadOnly` in the production account. The other three CloudWatch
datasources point at the wrong accounts.

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
dashboard can show that bots are ~91% of cpr traffic but not that they spend it
on `/api/v1/config` and `/api/v1/searches`. Those need Logs Insights against the
`aws-waf-logs-*` groups, and `MonitorReadOnly` lacks `logs:StartQuery`. Part 2
of the plan document covers it. The same queries run ad-hoc via the AWS CLI
meanwhile.

Country and device breakdowns were dropped: those dimensions cover **all**
traffic, not bots, which made them misleading on a bot dashboard.

## Pushing a change

Set `FOLDER` to `eelvoy0fey9s0a` for `Services/Navigator/Production`, or
`aelvox64z9zpcc` to test in `Services/WIP`. The dashboard URL is keyed on uid,
so moving between folders breaks no links.

```sh
FOLDER=eelvoy0fey9s0a

curl -s -X POST https://climatepolicyradar.grafana.net/api/dashboards/db \
  -H "Authorization: Bearer $(cat ~/.grafana-token)" \
  -H 'Content-Type: application/json' \
  -d @- <<< "$(FOLDER=$FOLDER python3 -c '
import json, os
d = json.load(open("infra/dashboards/waf-bots.json"))
d.pop("id", None)
print(json.dumps({"dashboard": d, "folderUid": os.environ["FOLDER"], "overwrite": True}))
')"
```

`overwrite: True` also discards any UI edits made since the last push, so only
ever push from this file.

Needs a Grafana service account token (Editor role) at `~/.grafana-token`.

## If a panel returns zeros

Two silent failures, both of which give zeros rather than an error: a template
variable in a CloudWatch dimension value (Grafana doesn't interpolate them
there, so WebACL names are written out), or a target missing
`region: us-east-1`.
