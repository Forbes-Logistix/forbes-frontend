/**
 * Puppeteer configuration.
 *
 * On Vercel and other CI, skip the ~280 MB Chromium download. The prerender
 * postbuild also short-circuits there (see scripts/prerender.js), so the
 * binary is never invoked. Locally, Chromium downloads as usual so
 * `npm run build` produces prerendered HTML.
 */
const isCI = !!(process.env.VERCEL || process.env.CI);

module.exports = {
  skipDownload: isCI,
};
