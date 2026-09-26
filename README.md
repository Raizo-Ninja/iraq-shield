# Iraq Shield

A site that tracks cyber attacks against Iraq and shows them on a map of the provinces, laid out like a security operations room.

Live at https://iraq-shield.com

## The idea

I wanted a way to make the cyber threats aimed at the region actually visible to anyone — not just numbers buried in reports. So this is a board that plots attacks across Iraq's 18 provinces: where the attack comes from, what type it is, the target, and whether it was blocked or ended in a breach, with the details of each incident.

The data isn't made up — it comes from Check Point ThreatCloud and refreshes every five minutes. If the live feed drops, the board falls back to a simulation mode so it's never empty.

## What it does

- An interactive map of Iraq with attack and defense motion, and a line drawn from the source of the attack to its target.
- A live log and a table of incidents, plus a detail card for each one.
- The whole site works in two languages, Arabic and English, with dark and light themes — and the choice is remembered per visitor.
- Login and accounts on Supabase, where each user only sees their own data.
- An admin panel with stats, charts, and user management.
- A learning section covering attack techniques, defense tools, and what to do if you get breached.

## Built with

Plain HTML, CSS, and JavaScript — no framework — with the map done in SVG. Accounts and data run on Supabase (Postgres with Row Level Security). The data collector is written in Python and runs automatically every five minutes through GitHub Actions. Hosting is GitHub Pages on a custom domain.

## Files

```
index.html            the whole site: map, log, table, academy
auth.js               login and accounts (Supabase)
admin.js              the admin panel
supabase-config.js    connection settings — publishable key only
setup.sql             database tables and RLS policies
admin.sql             admin roles
scripts/collect.py    the threat-data collector
data/live.json        latest data snapshot (generated automatically)
```

## Running it locally

```bash
git clone https://github.com/Raizo-Ninja/iraq-shield.git
cd iraq-shield
python3 -m http.server 8080
```

Then open http://localhost:8080

## A note on security

There are no passwords or secret keys inside the site files. Admin access is decided by the database itself through RLS policies, not by browser code. The only key that ships is the public publishable one.

## Disclaimer

Threat indicators come from public sources and are shown as-is. When live data isn't available, the board switches to a simulation mode for display and training.

---

Iraq Shield — Mohammed Ali Ismail, 2026
