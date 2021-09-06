import { AUTH_CONFIG } from "@dataware-tools/app-common";

const APP_ROUTE = {
  HOME: "/",
};

const SwrOptions = {
  errorRetryCount: 1,
};

const authConfig = {
  domain: AUTH_CONFIG.domain,
  clientId: AUTH_CONFIG.clientId,
  apiUrl: AUTH_CONFIG.apiUrl,
};

const redirectUri =
  typeof window === "undefined" ? null : `${window.location.origin}/callback`;

export { APP_ROUTE, SwrOptions, authConfig, redirectUri };
export * from "./fetchClient";
