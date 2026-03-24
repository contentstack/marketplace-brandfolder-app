/**
 * Contentstack web app origin for login + entry URLs.
 * NA (default): https://app.contentstack.com — set CONTENTSTACK_REGION=EU for EU stacks.
 */
export function defaultContentstackWebAppUrl(): string {
  const r = (process.env.CONTENTSTACK_REGION || "NA").toUpperCase();
  return r === "EU" ? "https://eu-app.contentstack.com" : "https://app.contentstack.com";
}

function normalizeCmsBase(raw: string): string {
  return raw.replace(/#.*$/, "").replace(/\/+$/, "");
}

/** ENV_URL wins; else non-local APP_HOST_URL; else regional default (NA → app.contentstack.com). */
export function contentstackWebAppBaseUrl(): string {
  if (process.env.ENV_URL) {
    return normalizeCmsBase(process.env.ENV_URL);
  }
  const host = process.env.APP_HOST_URL;
  if (host && !/localhost|127\.0\.0\.1/i.test(host)) {
    return normalizeCmsBase(host);
  }
  return defaultContentstackWebAppUrl();
}
