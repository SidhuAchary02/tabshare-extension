**Technical SEO Checklist — TabShare**

- **Robots & Sitemap:** Ensure `robots.txt` exists at the site root and points to `/sitemap.xml`. Keep the sitemap current after adding/removing pages.
- **Sitemap contents:** Include canonical URLs, `<lastmod>`, reasonable `<changefreq>`, and `<priority>` for homepage, blog index, and posts. Regenerate when content changes.
- **Canonical tags:** Add `<link rel="canonical" href="...">` in page `<head>` to prevent duplicate content issues.
- **Meta tags:** Each page should have unique `title`, `meta description`, `og:*` and `twitter:*` tags. Keep titles ~50-60 characters and descriptions ~120-160 characters.
- **Structured data:** Use JSON-LD for `WebSite`, `Organization`, `BreadcrumbList`, `Article`, and `FAQPage` where relevant. Validate with Rich Results test.
- **Performance / Core Web Vitals:**
  - **LCP:** Optimize large images (next-gen formats, resized, compressed), preload critical fonts, and reduce server response time (CDN, caching).
  - **CLS:** Reserve dimensions for images/ads; avoid injecting late DOM content; use `width`/`height` or CSS aspect-ratio.
  - **INP / FID:** Reduce main-thread JS (defer non-critical scripts), split bundles, and avoid heavy synchronous work.
- **Images:** Serve responsive images with `srcset` and `sizes`, use WebP/AVIF where supported, add `loading="lazy"` for offscreen images, include descriptive `alt` text for accessibility and SEO.
- **Ads & layout:** Keep ad placements stable to avoid CLS. Use reserved containers and lazy-load ads after main content. Maintain clear content-to-ad balance to avoid low-value-content flags.
- **Accessibility & crawlability:** Use semantic headings (H1..H3), meaningful link text, ARIA where needed, and ensure all navigational links are HTML anchors for crawlers.
- **Internal linking:** Link from the homepage/blog index to pillar posts. Add contextual internal links between related blog posts. Use descriptive anchor text.
- **Pagination & archives:** Use `rel="next"/"prev"` where appropriate; provide a clean blog index with crawlable lists.
- **URL structure:** Use short, hyphenated, lowercase slugs (e.g. `/blog/send-multiple-links.html`). Keep URLs consistent and permanent when possible.
- **Redirects:** Serve 301 redirects for moved content. Avoid chains.
- **Caching & headers:** Serve static assets with long `Cache-Control` and use immutable for content-addressed assets. Serve HTML with sensible short TTL but use CDN edge caching.
- **Preconnect & preload:** Add `preconnect` for critical third-party origins (fonts, analytics, CDN). Preload hero images and critical fonts.
- **Security headers:** Use HTTPS everywhere. Add `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, and a Content Security Policy (CSP) where feasible.
- **Robots meta:** Use `noindex,nofollow` for staging or low-value pages. Ensure paginated or tag pages are intentionally indexed.
- **Mobile-first:** Test and optimize mobile layouts; ensure buttons and tap targets are accessible and large enough.
- **Monitoring & alerts:** Use synthetic monitoring and set Lighthouse/CWV alerts. Track search console errors and fix crawl/index issues regularly.
- **Image sitemap (optional):** Include images in sitemap or use separate image sitemap for heavy image pages.
- **hreflang:** Add only if you publish in multiple languages.
- **Log and QA:** Periodically run Screaming Frog or site-crawler to find broken links, duplicate titles, missing meta, and large resources.

**Quick fixes prioritization**
- 1. Add `robots.txt` and `sitemap.xml` (done).
- 2. Ensure canonical tags on template pages.
- 3. Optimize hero images and preload fonts.
- 4. Defer non-critical JS and lazy-load ads/images.
- 5. Validate structured data for homepage and top blog posts.

**AdSense-specific notes**
- Reserve space for ad slots to avoid layout shifts.
- Avoid placing ads above the fold in a way that obscures primary content on mobile.
- Use clear site identity (About, Contact, Privacy) and visible contact links to improve trust.

**How to validate**
- Run Lighthouse (Performance, SEO, Accessibility).
- Use Google Search Console to submit sitemap and monitor coverage.
- Use Rich Results Test and Schema validators for JSON-LD.
- Check Core Web Vitals in PageSpeed Insights and set targets.

**Files touched**
- `/robots.txt`
- `/sitemap.xml`
- Update `head` sections of `index.html` and blog posts with canonical/meta/JSON-LD as needed.

