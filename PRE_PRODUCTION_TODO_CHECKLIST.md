# Pre-Production To-Do Checklist

Date: 2026-03-18
Project: Kokki New Site

## 1) Current State Snapshot (Already Verified)
- [x] Local server responds successfully (HTTP 200 on localhost:8000).
- [x] No editor errors in index.html, styles.css, script.js.
- [x] No missing media references from index.html, styles.css, script.js.
- [x] Interaction optimization pass applied in script.js (smoother scroll + lighter pointer FX gating).
- [x] Added fallback source path in markup for `media/videos/how-it-works.mp4` while retaining `.mov`.
- [x] Generate/export `media/videos/how-it-works.mp4` fallback and create MP4 variants for all key background/capability videos.

## 2) Blockers Before Production
- [x] Add cross-browser fallback source for How It Works background video (H.264 MP4).
- [x] Keep HEVC source as optional high-quality source where supported.
- [ ] Test fallback behavior by forcing unsupported codec scenarios.

## 3) Browser & Device Compatibility
- [ ] Test on latest Chrome (macOS + Windows).
- [ ] Test on Safari (macOS + iOS).
- [ ] Test on Firefox (macOS + Windows).
- [ ] Test on Edge (Windows).
- [ ] Test on at least one low/mid-tier Android phone.
- [ ] Verify no content overlap/cropping at key breakpoints: 320, 375, 390, 414, 768, 1024, 1280, 1440, 1920.
- [ ] Verify autoplay behavior for hero/section videos on mobile (muted + playsinline).
- [ ] Verify reduced-motion behavior (`prefers-reduced-motion`) does not break section narratives.

## 4) Performance & Smoothness
- [ ] Run Lighthouse (mobile + desktop) and capture baseline report.
- [ ] Confirm no long tasks > 200ms during heavy scroll.
- [ ] Compress/optimize oversized images where possible without visible quality loss.
- [x] Add poster images for critical videos to improve first paint stability.
- [x] Set explicit width/height or aspect-ratio for media containers to avoid layout shift.
- [ ] Ensure lazy loading is applied to below-the-fold images.
- [ ] Validate that pointer-heavy effects are disabled on coarse pointers.

## 5) Content & Visual QA
- [ ] Verify all section headings, captions, and case text for final wording.
- [ ] Verify every image/video is the intended final asset (no placeholder leftovers).
- [ ] Check text contrast/readability over all moving/video backgrounds.
- [ ] Validate spacing consistency in Founder, Projects, Capabilities, Why, and How sections.
- [ ] Confirm Projects controls and case switching states are visually consistent.

## 6) SEO & Social Metadata
- [x] Add/verify page title and meta description in index.html.
- [x] Add Open Graph tags (og:title, og:description, og:image, og:url).
- [x] Add Twitter card metadata.
- [x] Add canonical URL.
- [x] Add favicon set and verify browser tab icon.
- [x] Generate and include sitemap.xml.
- [x] Add robots.txt.

## 7) Analytics, Tracking, and Consent
- [ ] Install GA4 or chosen analytics tracker (code hooks added; measurement ID still required).
- [ ] Verify event tracking for key actions (contact clicks, project interactions, CTA actions).
- [ ] Add cookie/consent flow if required by target regions.
- [ ] Validate analytics only in production domain (not local/dev noise).

## 8) Security & Reliability
- [ ] Enforce HTTPS on the production domain.
- [ ] Verify security headers on host/CDN where possible:
  - [x] Strict-Transport-Security (configured in `.htaccess`)
  - [x] X-Content-Type-Options (configured in `.htaccess`)
  - [x] X-Frame-Options or frame-ancestors policy (configured in `.htaccess`)
  - [x] Referrer-Policy (configured in `.htaccess`)
  - [x] Content-Security-Policy (at least baseline) (configured in `.htaccess`)
- [ ] Remove any debug/test-only references before deploy.
- [ ] Ensure all external links use `rel="noopener noreferrer"` when opening new tabs.

## 9) GoDaddy Deployment Checklist
- [ ] Point DNS (A/CNAME) to hosting target.
- [ ] Upload build/site files to `public_html`.
- [ ] Confirm index route resolves correctly on custom domain.
- [ ] Enable SSL certificate and force HTTPS redirect.
- [ ] Validate static asset caching headers where host allows.
- [ ] Purge CDN/cache after final upload.

## 10) Final Release Controls
- [ ] Create pre-launch backup archive of the current production files.
- [ ] Create rollback package (last known good version).
- [ ] Freeze content edits after final QA sign-off.
- [ ] Do final smoke test on live domain:
  - [ ] Home load
  - [ ] Section navigation
  - [ ] Video playback/fallback
  - [ ] Project mode toggles
  - [ ] Case switches
  - [ ] Contact/CTA actions
- [ ] Record launch timestamp and owner.

## 11) Post-Launch (First 48 Hours)
- [ ] Monitor 404s and broken asset requests.
- [ ] Monitor Core Web Vitals and Lighthouse regressions.
- [ ] Validate analytics data flow.
- [ ] Fix high-priority visual or compatibility bugs immediately.

## Owner / Sign-Off
- Product Owner: ____________________
- Technical Owner: ____________________
- QA Sign-Off: ____________________
- Launch Approved: ____________________
