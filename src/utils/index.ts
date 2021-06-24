import { useRef, useEffect } from "react";
const APP_ROUTE = {
  HOME: "/",
};

const SwrOptions = {
  errorRetryCount: 1,
};

const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export { APP_ROUTE, SwrOptions, usePrevious };
export * from "./utilTypes";
export * from "./fetchClient";
