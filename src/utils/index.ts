export function isNonNullable<T>(val: T): val is NonNullable<T> {
  return val !== null && val !== undefined;
}

export function getURLParam(param: string): string | null {
  return new URLSearchParams(window.location.search).get(param);
}

export type PathParamConvertibleObj = Record<
  string,
  string | number | undefined | null
>;

export function ObjToParamString(obj: PathParamConvertibleObj): string {
  let flag = true;
  let paramString = "";
  for (const [key, value] of Object.entries(obj)) {
    if (flag && value) {
      paramString += `?${key}=${value}`;
      flag = false;
    } else if (value) {
      paramString += `&${key}=${value}`;
    }
  }
  return paramString;
}

export function addParamToURL(
  newParam: string | PathParamConvertibleObj,
  method: "push" | "replace"
): void {
  if (newParam === "" || newParam === "?" || newParam === "&") {
    return;
  }
  const currentParamObj = new URLSearchParams(window.location.search);
  const newParamObj = new URLSearchParams(
    typeof newParam === "string" ? newParam : ObjToParamString(newParam)
  );

  for (const key of newParamObj.keys()) {
    if (currentParamObj.has(key)) {
      currentParamObj.delete(key);
    }
  }

  const currentParamString = currentParamObj.toString();
  const newParamString = newParamObj.toString();
  const newRelativeURL =
    currentParamString === "" && newParamString === ""
      ? ""
      : currentParamString === "" && newParamString !== ""
      ? `?${newParamString}`
      : currentParamString !== "" && newParamString === ""
      ? `?${currentParamString}`
      : `?${currentParamString}&${newParamString}`;
  if (method === "push") {
    console.log("pushed!");
    history.pushState(null, "", newRelativeURL);
  } else if (method === "replace") {
    console.log("replaced!");
    history.replaceState(null, "", newRelativeURL);
  }
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
