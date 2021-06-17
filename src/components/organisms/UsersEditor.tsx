import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import useSWR, { mutate } from "swr";
import {
  permissionManager,
  LoadingIndicator,
  ErrorMessage,
  ErrorMessageProps,
  PerPageSelect,
  SearchForm,
  PageToolBar,
  Spacer,
  getQueryString,
  API_ROUTE,
  objToQueryString,
  addQueryString,
  PageMain,
} from "@dataware-tools/app-common";

import { makeStyles } from "@material-ui/core/styles";
import AddCircle from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import Pagination from "@material-ui/core/Pagination";

import { UserList, UserListProps } from "./UserList";

const useStyles = makeStyles(() => ({
  paginationContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
}));
const UsersEditor = (): JSX.Element => {
  // TODO: save per_page to local state
  const [searchText, setSearchText] = useState(
    getQueryString("searchText") || ""
  );
  const [perPage, setPerPage] = useState(
    Number(getQueryString("perPage")) || 20
  );
  const [page, setPage] = useState(Number(getQueryString("page")) || 1);
  const { getAccessTokenSilently } = useAuth0();
  const [error, setError] = useState<null | ErrorMessageProps>(null);

  const styles = useStyles();

  const listUsers = async () => {
    permissionManager.OpenAPI.TOKEN = await getAccessTokenSilently();
    permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
    const listUsersRes = await permissionManager.UserService.listUsers({
      perPage: perPage,
      page: page,
      search: searchText,
    });
    return listUsersRes;
  };

  const listUsersQuery = objToQueryString({
    per_page: perPage,
    page: page,
    search_text: searchText,
  });
  const listUsersURL = `${API_ROUTE.PERMISSION.BASE}/users${listUsersQuery}`;

  const { data: listUsersRes, error: listUsersError } = useSWR(
    listUsersURL,
    listUsers
  );

  const listRoles = async () => {
    permissionManager.OpenAPI.TOKEN = await getAccessTokenSilently();
    permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
    const listRolesRes = permissionManager.RoleService.listRoles({
      perPage: 0,
    });
    return listRolesRes;
  };

  const listRolesQuery = `?per_page=0`;
  const listRolesURL = `${API_ROUTE.PERMISSION.BASE}/roles${listRolesQuery}`;

  const { data: listRolesRes, error: listRolesError } = useSWR(
    listRolesURL,
    listRoles
  );

  const updateUser: UserListProps["onUpdateUser"] = (target) => {
    // update cache by local data
    const prev = listUsersRes;
    const newLocalUsers = prev?.users.map((user) => {
      if (user.user_id !== target.user_id) {
        return user;
      } else {
        return target;
      }
    });
    mutate(listUsersURL, { ...prev, users: newLocalUsers }, false);

    try {
      mutate(listUsersURL, async () => {
        try {
          permissionManager.OpenAPI.TOKEN = await getAccessTokenSilently();
          permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
          const newTarget = await permissionManager.UserService.updateUser({
            userId: target.user_id,
            requestBody: {
              role_ids: target.roles.map(
                (role) => role.role_id as permissionManager.RoleModel["role_id"]
              ),
            },
          });
          const newUsers = prev?.users.map((user) =>
            user.user_id !== newTarget.user_id ? user : newTarget
          );
          return { ...prev, users: newUsers };
        } catch (error) {
          setError({
            reason: JSON.stringify(error),
            instruction: "please reload this page",
          });
          return undefined;
        }
      });
    } catch (error) {
      setError({
        reason: JSON.stringify(error),
        instruction: "please reload this page",
      });
    }
  };

  useEffect(() => {
    addQueryString({ page, perPage, searchText }, "replace");
  }, [page, perPage, searchText]);

  return (
    <>
      <PageToolBar
        right={
          <>
            <SearchForm
              onSearch={(newSearchText) => setSearchText(newSearchText)}
              defaultValue={searchText}
            />
            <Spacer direction="horizontal" size="15px" />
            <PerPageSelect
              perPage={perPage}
              setPerPage={setPerPage}
              values={[10, 20, 50, 100]}
            />
            <Spacer direction="horizontal" size="15px" />
            <Button
              href="https://manage.auth0.com/dashboard/us/hdwlab-com/users"
              startIcon={<AddCircle />}
            >
              Add User
            </Button>
          </>
        }
      />
      {listRolesRes?.roles?.length === 0 ? (
        <div>
          <strong>No roles defined! Please define role!</strong>
        </div>
      ) : null}
      <PageMain>
        {listUsersError || listRolesError ? (
          <ErrorMessage
            reason={JSON.stringify(listUsersError || listRolesError)}
            instruction="please reload this page"
          />
        ) : error ? (
          <ErrorMessage reason={error.reason} instruction={error.instruction} />
        ) : listUsersRes && listRolesRes ? (
          <UserList
            users={listUsersRes.users}
            roles={listRolesRes.roles}
            onUpdateUser={updateUser}
          />
        ) : (
          <LoadingIndicator />
        )}
      </PageMain>
      <Spacer direction="vertical" size="1vh" />
      {listUsersRes ? (
        <div className={styles.paginationContainer}>
          <Pagination
            count={Math.ceil(listUsersRes.total / listUsersRes.per_page)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
          />
        </div>
      ) : null}
    </>
  );
};

export { UsersEditor };
