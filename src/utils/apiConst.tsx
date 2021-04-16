// TODO: move to @dataware-tools/app-common
import { API_CATALOG } from "@dataware-tools/app-common";

const API_HOME: string =
  process.env.NEXT_PUBLIC_BACKEND_API_PREFIX || "/api/latest";

const constructApiBaseUrl = (url: string) => `${API_HOME}${url}`;

const databaseStorePrefix: string = API_CATALOG.databaseStore.endpoint;
const recordStorePrefix: string = API_CATALOG.recordStore.endpoint;
const jobStorePrefix: string = API_CATALOG.jobStore.endpoint;
const contentStorePrefix: string = API_CATALOG.contentStore.endpoint;
const fileProviderPrefix: string = API_CATALOG.fileProvider.endpoint;
const permissionManagerPrefix: string = API_CATALOG.permissionManager.endpoint;

export const API_ROUTE = {
  RECORD: {
    BASE: constructApiBaseUrl(recordStorePrefix),
  },
  JOB: {
    BASE: constructApiBaseUrl(jobStorePrefix),
  },
  CONTENT: {
    BASE: constructApiBaseUrl(contentStorePrefix),
  },
  FILE: {
    BASE: constructApiBaseUrl(fileProviderPrefix),
  },
  DATABASE: {
    BASE: constructApiBaseUrl(databaseStorePrefix),
  },
  PERMISSION: {
    BASE: constructApiBaseUrl(permissionManagerPrefix),
  },
};
export type FetchStatusType = {
  isFetchDone: boolean;
  isFetchFailed: boolean;
  isFetching: boolean;
};
