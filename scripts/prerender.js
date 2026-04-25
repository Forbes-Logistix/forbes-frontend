/**
 * Static prerender for the CRA build.
 *
 * Spawns `npx serve -s build` against the freshly built bundle, then drives a
 * headless Chromium through each route to capture the post-hydration HTML.
 * Each route is written to `build/<route>/index.html` so crawlers, link
 * preview bots, and slow connections see the real content (and per-route
 * <Helmet> metadata) without waiting for client-side React.
 */
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const PORT = 4173;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const ROUTES = [
  "/",
  "/aboutUs",
  "/operations",
  "/careers",
  "/contactUs",
  "/apply",
];

function waitFor(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve();
      } catch {
        // server not up yet
      }
      if (Date.now() - start > timeoutMs) return reject(new Error(`server didn't come up at ${url}`));
      setTimeout(tick, 250);
    };
    tick();
  });
}

async function main() {
  // Skip on Vercel and other CI builds where puppeteer's bundled Chromium
  // can't launch without sysdeps. Local builds still prerender. A
  // follow-up will swap to @sparticuz/chromium for Vercel-native prerender.
  if (process.env.VERCEL || process.env.SKIP_PRERENDER) {
    console.log("[prerender] skipped (Vercel/CI build); Helmet handles client-side metadata.");
    return;
  }

  const buildDir = path.resolve(__dirname, "..", "build");
  if (!fs.existsSync(buildDir)) {
    console.error("[prerender] build directory missing — run `npm run build` first");
    process.exit(1);
  }

  console.log(`[prerender] starting static server at ${ORIGIN}`);
  const server = spawn(
    "npx",
    ["serve", "-s", "build", "-l", String(PORT), "--no-clipboard"],
    { stdio: ["ignore", "pipe", "pipe"], shell: true }
  );
  server.stdout.on("data", () => {});
  server.stderr.on("data", () => {});

  try {
    await waitFor(ORIGIN);
  } catch (err) {
    server.kill();
    throw err;
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const route of ROUTES) {
      const url = `${ORIGIN}${route}`;
      console.log(`[prerender] ${route}`);
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 250))
      );

      const html = await page.content();
      await page.close();

      const targetDir = route === "/" ? buildDir : path.join(buildDir, route);
      fs.mkdirSync(targetDir, { recursive: true });
      const targetFile = path.join(targetDir, "index.html");
      fs.writeFileSync(targetFile, html, "utf8");
    }
  } finally {
    await browser.close();
    server.kill();
  }

  console.log("[prerender] done");
}

main().catch((err) => {
  console.error("[prerender] failed:", err);
  process.exit(1);
});
