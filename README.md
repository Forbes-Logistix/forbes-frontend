# Forbes Logistix — Marketing Site

Next.js 16 (App Router) marketing & recruiting site for Forbes Logistix, LLC. Lives at https://forbeslogistix.com.

## Stack

- **Framework**: Next.js 16, React 18, App Router
- **Styling**: Tailwind CSS 3
- **Animation**: framer-motion
- **Icons**: lucide-react
- **Hosting**: Vercel
- **Forms**: post to the companion API at `forbes-logistix-backend.vercel.app` (`/api/contact`, `/api/lead`)
- **Bot protection**: Cloudflare Turnstile (Managed mode), gated by `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- **DNS**: Cloudflare; **Email**: M365 (Graph sendMail from the backend)

## Local development

```bash
npm install
npm run dev
```

Runs at http://localhost:3000. Forms hit the production backend by default.

## Build

```bash
npm run build
```

All routes are statically prerendered — see Next.js build output.

## Environment variables

| Variable | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Vercel (frontend) | Optional. When unset, forms still submit but no Turnstile widget renders and the backend skips verification. |

The companion backend has its own env vars (Graph credentials, recipient emails, Turnstile secret) — see the canonical handoff doc.

## Layout

- `app/` — App Router pages, components, lib, globals.css
  - `page.js` — home (Run with the Buffalo)
  - `about/`, `operations/`, `careers/`, `contact/`, `apply/`, `privacy/`, `terms/` — page directories. `*Client.js` files are the client components; `page.js` is the server wrapper that exports `metadata` + JSON-LD.
  - `components/Navbar.js`, `components/Footer.js`, `components/QuickApplyForm.js`
  - `lib/schema.js` — shared building blocks for Organization / LocalBusiness / JobPosting JSON-LD
  - `lib/styles.js` — shared className constants (currently just `NAV_LINK`)
  - `globals.css` — Tailwind base + global focus-visible accessibility ring
  - `sitemap.js`, `robots.js` — generated on every build
- `public/assets/` — photos (`photos/`), buffalo brand mark, logo, hero video + poster
- `next.config.js` — legacy CRA URL redirects (`/aboutUs` → `/about`, `/contactUs` → `/contact`)
- `vercel.json` — security headers (CSP, HSTS, X-Frame-Options, etc.)

## Canonical handoff doc

The full runbook (env var catalog, Vercel/Cloudflare/Entra dashboards, disaster-recovery rebuild guide, security posture, glossary) lives in OneDrive — not in this repo. Ask the owner for the path.
