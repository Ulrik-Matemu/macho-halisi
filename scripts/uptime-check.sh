#!/usr/bin/env bash
# Probes the public site and backend API, then records the results on the
# backend (POST /monitoring/uptime) for the dashboard's Monitoring page.
#
# Run by .github/workflows/uptime.yml every 5 minutes; also runnable locally:
#   SITE_URL=http://localhost:3000 API_URL=http://localhost:4000 \
#   MONITOR_SECRET=... bash scripts/uptime-check.sh
#
# Exits non-zero when any probe fails, so the workflow run goes red and
# GitHub's own failure notification doubles as a basic alert.
set -uo pipefail

: "${SITE_URL:?SITE_URL is required}"
: "${API_URL:?API_URL is required}"
: "${MONITOR_SECRET:?MONITOR_SECRET is required}"

SITE_URL="${SITE_URL%/}"
API_URL="${API_URL%/}"
TIMEOUT=20
CHECKS="[]"
FAILED=0

# probe TARGET URL [expect_json_db]
probe() {
  local target="$1" url="$2" check_db="${3:-}"
  local body_file err_file out code time_s latency ok error curl_status
  body_file="$(mktemp)"
  err_file="$(mktemp)"

  out="$(curl -sS -o "$body_file" -w '%{http_code} %{time_total}' \
    --max-time "$TIMEOUT" -H 'User-Agent: MachoHalisi-UptimeMonitor/1.0' "$url" 2>"$err_file")"
  curl_status=$?

  if [ $curl_status -ne 0 ]; then
    code=0
    latency=null
    ok=false
    error="$(sed -e 's/^curl: ([0-9]*) //' "$err_file" | tail -n1 | cut -c1-200)"
    [ -n "$error" ] || error="curl exit $curl_status"
  else
    code="${out%% *}"
    time_s="${out##* }"
    latency="$(awk -v t="$time_s" 'BEGIN { printf "%d", t * 1000 }')"
    if [ "$code" -ge 200 ] && [ "$code" -lt 400 ]; then ok=true; error=""; else ok=false; error="HTTP $code"; fi
  fi

  CHECKS="$(jq -c --arg target "$target" --arg url "$url" --argjson ok "$ok" \
    --argjson code "${code:-0}" --argjson latency "$latency" --arg error "$error" \
    '. + [{target: $target, url: $url, ok: $ok,
           statusCode: (if $code == 0 then null else $code end),
           latencyMs: $latency,
           error: (if $error == "" then null else $error end)}]' <<<"$CHECKS")"
  [ "$ok" = true ] || FAILED=1
  echo "$( [ "$ok" = true ] && echo ✅ || echo ❌ ) $target $url -> ${code} ${latency}ms ${error}"

  # The API health endpoint also reports database connectivity — record it
  # as its own target so a DB outage is distinguishable from an API outage.
  if [ -n "$check_db" ]; then
    local db_ok db_latency db_error
    db_ok="$(jq -r '.database.connected // false' "$body_file" 2>/dev/null || echo false)"
    db_latency="$(jq -r '.database.latencyMs // "null"' "$body_file" 2>/dev/null || echo null)"
    [ "$db_ok" = true ] && db_error="" || db_error="Database not connected"
    [ "$ok" = true ] || { db_ok=false; db_error="API unreachable"; db_latency=null; }
    CHECKS="$(jq -c --arg url "$url#database" --argjson ok "$db_ok" --argjson latency "$db_latency" --arg error "$db_error" \
      '. + [{target: "DATABASE", url: $url, ok: $ok, statusCode: null, latencyMs: $latency,
             error: (if $error == "" then null else $error end)}]' <<<"$CHECKS")"
    [ "$db_ok" = true ] || FAILED=1
    echo "$( [ "$db_ok" = true ] && echo ✅ || echo ❌ ) DATABASE via $url ${db_error}"
  fi

  rm -f "$body_file" "$err_file"
}

probe SITE "$SITE_URL/"
probe PAGE "$SITE_URL/itineraries"
probe PAGE "$SITE_URL/enquire"
probe API "$API_URL/health" db

payload="$(jq -c --arg source "${MONITOR_SOURCE:-github-actions}" '{source: $source, checks: .}' <<<"$CHECKS")"
record_status="$(curl -sS -o /dev/null -w '%{http_code}' --max-time "$TIMEOUT" \
  -X POST "$API_URL/monitoring/uptime" \
  -H 'Content-Type: application/json' \
  -H "X-Monitor-Secret: $MONITOR_SECRET" \
  --data "$payload" 2>/dev/null)" || true
record_status="${record_status:-000}"

if [ "$record_status" != "201" ]; then
  # Expected while the API itself is down — the dashboard shows the gap as
  # "monitor silent" and the red workflow run is the alert.
  echo "⚠️  Could not record results on the backend (HTTP $record_status)"
fi

exit $FAILED
