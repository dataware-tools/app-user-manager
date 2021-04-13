export function isNonNullable<T>(val: T): val is NonNullable<T> {
  return val !== null && val !== undefined;
}

export const APP_ROUTE = {
  HOME: "/",
};

export const SwrOptions = {
  errorRetryCount: 1,
};

export { Spacer } from "./Spacer";
export { API_ROUTE } from "./apiConst";
export type { FetchStatusType } from "./apiConst";
