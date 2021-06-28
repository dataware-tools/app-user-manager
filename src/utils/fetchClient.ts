import {
  API_ROUTE,
  metaStore,
  objToQueryString,
  permissionManager,
  AwaitType,
} from "@dataware-tools/app-common";
import useSWR from "swr";

type Data<T> = T extends void | undefined | null
  ? "__fetchSuccess__" | undefined
  : T | undefined;

const fetchAPI = async <T, U>(
  fetcher: (args: T) => Promise<U>,
  param: T
): Promise<[data: Data<U>, error: any]> => {
  try {
    const res = await fetcher(param);
    // See: https://miyauchi.dev/ja/posts/typescript-conditional-types#%E5%9E%8B%E5%AE%9A%E7%BE%A9%E3%81%A8-conditional-types
    return [(res || "__fetchSuccess__") as Data<U>, undefined];
  } catch (error) {
    return [undefined as Data<U>, error];
  }
};

const fetchPermissionManager = async <T, U>(
  token: string | (() => Promise<string>),
  fetcher: (args: T) => Promise<U>,
  param: T
): Promise<[data: Data<U>, error: any]> => {
  permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
  permissionManager.OpenAPI.TOKEN = token;
  return await fetchAPI(fetcher, param);
};
interface UseAPI<T extends (...args: any) => Promise<any>> {
  (
    token: string | (() => Promise<string>),
    param: Partial<Parameters<T>[number]>,
    shouldFetch?: boolean
  ): [data: AwaitType<ReturnType<T>> | undefined, error: any, cacheKey: string];
}

const useListDatabases: UseAPI<
  typeof metaStore.DatabaseService.listDatabases
> = (token, { ...query }, shouldFetch = true) => {
  const cacheQuery = objToQueryString({ ...query });
  const cacheKey = `${API_ROUTE.META.BASE}/databases${cacheQuery}`;
  const fetcher = async () => {
    metaStore.OpenAPI.TOKEN = token;
    metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
    const res = await metaStore.DatabaseService.listDatabases(query);
    return res;
  };
  // See: https://swr.vercel.app/docs/conditional-fetching
  const { data, error } = useSWR(shouldFetch ? cacheKey : null, fetcher);
  return [data, error, cacheKey];
};

const useListActions: UseAPI<
  typeof permissionManager.ActionService.listActions
> = (token, { ...query }, shouldFetch = true) => {
  const cacheQuery = objToQueryString({ ...query });
  const cacheKey = `${API_ROUTE.PERMISSION.BASE}/actions${cacheQuery}`;
  const fetcher = async () => {
    permissionManager.OpenAPI.TOKEN = token;
    permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
    const res = await permissionManager.ActionService.listActions(query);
    return res;
  };
  // See: https://swr.vercel.app/docs/conditional-fetching
  const { data, error } = useSWR(shouldFetch ? cacheKey : null, fetcher);
  return [data, error, cacheKey];
};

const useGetRole: UseAPI<typeof permissionManager.RoleService.getRole> = (
  token,
  { roleId, ...query },
  shouldFetch = true
) => {
  const cacheQuery = objToQueryString({ ...query });
  const cacheKey = `${API_ROUTE.PERMISSION.BASE}/roles${roleId}${cacheQuery}`;
  const fetcher = roleId
    ? async () => {
        permissionManager.OpenAPI.TOKEN = token;
        permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
        const res = await permissionManager.RoleService.getRole({
          roleId,
          ...query,
        });
        return res;
      }
    : null;
  // See: https://swr.vercel.app/docs/conditional-fetching
  const { data, error } = useSWR(
    shouldFetch && roleId ? cacheKey : null,
    fetcher
  );
  return [data, error, cacheKey];
};

const useListRoles: UseAPI<typeof permissionManager.RoleService.listRoles> = (
  token,
  { ...query },
  shouldFetch = true
) => {
  const cacheQuery = objToQueryString({ ...query });
  const cacheKey = `${API_ROUTE.PERMISSION.BASE}/roles${cacheQuery}`;
  const fetcher = async () => {
    permissionManager.OpenAPI.TOKEN = token;
    permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
    const res = await permissionManager.RoleService.listRoles(query);
    return res;
  };
  // See: https://swr.vercel.app/docs/conditional-fetching
  const { data, error } = useSWR(shouldFetch ? cacheKey : null, fetcher);
  return [data, error, cacheKey];
};

export {
  useListDatabases,
  fetchAPI,
  fetchPermissionManager,
  useListActions,
  useGetRole,
  useListRoles,
};
