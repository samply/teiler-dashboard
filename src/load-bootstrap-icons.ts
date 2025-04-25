/**
 * Dynamically loads and rewrites the `bootstrap-icons.css` file at runtime.
 *
 * Context:
 * - This Angular microfrontend runs inside a single-spa architecture and may be served from a different
 *   origin or base path than the root application (e.g., in development or multilingual routes like /de, /en).
 * - The `bootstrap-icons.css` file includes relative `url(...)` references to font files (e.g., .woff),
 *   which break in this setup because they're resolved relative to the root application.
 *
 * Why this approach:
 * - Using a CDN like jsDelivr would solve this, but it's not an option — some target environments
 *   where this app is deployed have **no internet access**.
 * - Therefore, we:
 *   1. Import the CSS as a string using Webpack's `raw-loader` via `?raw`.
 *   2. Replace all relative font URLs in the CSS with absolute paths pointing to the local assets directory.
 *   3. Inject the resulting CSS into a `<style>` element in the document head.
 *
 * Benefits:
 * - The rewritten paths ensure font files load correctly in **both development and production**.
 * - Manually injecting CSS avoids CSP issues during local development (e.g., when served over HTTP).
 * - Bundling everything into the `main.js` also guarantees functionality in **offline environments**.
 *
 * Supporting setup:
 * - `extra-webpack.config.js` defines the rule for `*.css?raw`.
 * - `raw-loader.d.ts` tells TypeScript how to handle `*.css?raw` imports.
 */

import css from 'bootstrap-icons/font/bootstrap-icons.css?raw';

export function loadBootstrapIconsCss(baseUrl: string): void {
  const style = document.createElement('style');
  style.innerHTML = css.replace(/url\((.+?)\)/g, (_: string, match: string) => {
    const cleaned = match.replace(/['"]/g, '');
    return `url('${baseUrl}/assets/${cleaned}')`;
  });
  document.head.appendChild(style);
}
