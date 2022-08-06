import { AUTH_CONFIG } from "@dataware-tools/app-common";
import { SWRConfig } from "swr";

const APP_ROUTE = {
  HOME: "/",
};

const SwrOptions: Parameters<typeof SWRConfig>[0]["value"] = {
  errorRetryCount: 1,
  fetcher: (url) => fetch(url).then((res) => res.json()),
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
export * from "./toasts";
