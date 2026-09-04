#!/usr/bin/env python3
"""Iraq Shield data collector.
Pulls public threat-intel feeds (Check Point ThreatCloud live map, Radware live map)
and writes data/live.json for the static site. Runs on a GitHub Actions schedule.
"""
import json, time, os, urllib.request, datetime

UA = {"User-Agent": "Mozilla/5.0 (IraqShield collector; +https://iraq-shield.com)"}
OUT = "data/live.json"
CAPTURE_SECONDS = 55


def get_json(url, timeout=20):
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read().decode("utf-8", "ignore")
            return json.loads(body) if body.strip() else None
    except Exception as e:
        print("skip", url, e)
        return None


def capture_checkpoint_feed(seconds):
    """Stream the SSE feed for N seconds and collect attack events."""
    events, counter = [], None
    try:
        req = urllib.request.Request("https://threatmap-api.checkpoint.com/ThreatMap/api/feed", headers=UA)
        with urllib.request.urlopen(req, timeout=30) as r:
            deadline = time.time() + seconds
            ev = None
            while time.time() < deadline:
                line = r.readline().decode("utf-8", "ignore").strip()
                if not line:
                    ev = None
                    continue
                if line.startswith("event:"):
                    ev = line[6:].strip()
                elif line.startswith("data:"):
                    try:
                        d = json.loads(line[5:])
                    except Exception:
                        continue
                    if ev == "attack":
                        d["ts"] = int(time.time())
                        events.append(d)
                    elif ev == "counter" or (ev is None and "today" in d):
                        counter = d
    except Exception as e:
        print("feed error", e)
    return events, counter


def main():
    now = datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
    top = get_json("https://threatmap-api.checkpoint.com/ThreatMap/api/topStats")
    events, counter = capture_checkpoint_feed(CAPTURE_SECONDS)

    radware = {}
    for name, url in {
        "attacks": "https://ltm-prod-api.radware.com/map/attacks?limit=50",
        "top_attackers": "https://ltm-prod-api.radware.com/top/attackers?interval=hour",
        "top_attacked": "https://ltm-prod-api.radware.com/top/attacked?interval=hour",
        "top_ddos": "https://ltm-prod-api.radware.com/top/ddos?interval=hour",
        "top_ports": "https://ltm-prod-api.radware.com/top/ports?interval=hour",
    }.items():
        radware[name] = get_json(url)

    # aggregate source countries from the captured window
    src_counts, dst_counts, types = {}, {}, {}
    for e in events:
        src_counts[e.get("s_co") or "??"] = src_counts.get(e.get("s_co") or "??", 0) + 1
        dst_counts[e.get("d_co") or "??"] = dst_counts.get(e.get("d_co") or "??", 0) + 1
        types[e.get("a_t") or "other"] = types.get(e.get("a_t") or "other", 0) + 1

    payload = {
        "updated": now,
        "sources": ["Check Point ThreatCloud Live Map", "Radware Live Threat Map"],
        "checkpoint": {
            "today": (counter or {}).get("today"),
            "recentPeriod": (counter or {}).get("recentPeriod"),
            "top": top,
            "window_seconds": CAPTURE_SECONDS,
            "events": events[-400:],
            "src_counts": src_counts,
            "dst_counts": dst_counts,
            "type_counts": types,
            "iraq_events": [e for e in events if e.get("d_co") == "IQ" or e.get("s_co") == "IQ"],
        },
        "radware": radware,
    }
    os.makedirs("data", exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))
    print(f"wrote {OUT}: {len(events)} events, top={'ok' if top else 'none'}")


if __name__ == "__main__":
    main()
