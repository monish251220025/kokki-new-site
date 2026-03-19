# Cloudflare Pages Setup

## Goal
Deploy this static site to Cloudflare Pages and connect the GoDaddy domain `kokkiusa.com` with `www.kokkiusa.com` as the canonical production hostname.

## Current Project Assumptions
- Hosting platform: Cloudflare Pages
- Registrar: GoDaddy
- Canonical hostname: `https://www.kokkiusa.com/`
- Contact form backend: FormSubmit.co
- Analytics: GA4 placeholder exists but measurement ID still needs to be added

## Files Added For Cloudflare
- `_headers`: Cloudflare-native security headers and cache behavior
- `_redirects`: apex-to-www and HTTP-to-HTTPS redirects
- `.htaccess`: legacy Apache config, not used by Cloudflare Pages

## What You Need To Do

### 1. Put the site in a Git repository
Recommended repo root:
- `kokki-new-site/`

Minimum contents should include:
- `index.html`
- `contact.html`
- `styles.css`
- `script.js`
- `robots.txt`
- `sitemap.xml`
- `_headers`
- `_redirects`
- `Images/`
- `media/`
- `assets/`

### 2. Create the Cloudflare Pages project
In Cloudflare:
- Go to `Workers & Pages`
- Click `Create application`
- Choose `Pages`
- Choose `Connect to Git`
- Select your repository

Use these settings:
- Framework preset: `None`
- Build command: leave empty
- Build output directory: `/` if repo root is the site root
- Root directory: set to `kokki-new-site` only if the repo contains other folders above it

### 3. Deploy preview first
After the first deploy:
- Open the preview URL
- Confirm homepage and contact page load
- Confirm videos load
- Confirm How It Works interaction works
- Confirm form posts to FormSubmit.co

### 4. Add the custom domain
In Cloudflare Pages:
- Open the Pages project
- Go to `Custom domains`
- Add:
  - `www.kokkiusa.com`
  - `kokkiusa.com`

### 5. Point GoDaddy to Cloudflare
In Cloudflare, when you add the domain, you will receive two nameservers.

In GoDaddy:
- Open domain settings for `kokkiusa.com`
- Go to `Nameservers`
- Choose `Change`
- Select `Enter my own nameservers`
- Paste the two Cloudflare nameservers
- Save

### 6. Enable SSL and redirects
In Cloudflare dashboard:
- SSL/TLS mode: `Full` or `Flexible` if you have no origin certificate path involved on Pages; Pages typically handles this automatically
- Enable `Always Use HTTPS`
- Keep `_redirects` in place so apex redirects to `www`

### 7. Finish launch-critical configuration
Before going live:
- Add your real GA4 measurement ID in:
  - `index.html`
  - `contact.html`
- Verify FormSubmit recipient email is correct
- Verify canonical URLs remain `https://www.kokkiusa.com/`

## Recommended Production Checks
- `https://www.kokkiusa.com/` loads
- `https://kokkiusa.com/` redirects to `https://www.kokkiusa.com/`
- Contact form submits successfully
- Videos autoplay/fallback correctly on desktop and mobile
- Lighthouse desktop and mobile pass at acceptable levels
- GA4 DebugView receives pageview and CTA events

## Notes
- Do not rely on `.htaccess` on Cloudflare Pages
- Cloudflare Pages will use `_headers` and `_redirects` instead
- If the repo root is not the site root, configure Pages `Root directory` correctly during setup
