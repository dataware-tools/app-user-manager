import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import useSWR, { mutate } from "swr";
import { permissionManager } from "@dataware-tools/app-common";

import { makeStyles } from "@material-ui/core/styles";
import AddCircle from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import Pagination from "@material-ui/core/Pagination";

import {
  API_ROUTE,
  Spacer,
  getURLParam,
  ObjToParamString,
  addURLParam,
} from "../../utils";
import { SearchForm } from "../molecules/SearchForm";
import { ToolBar } from "./ToolBar";
import { UserList, UserListProps } from "./UserList";
import { ErrorMessage, ErrorMessageProps } from "../molecules/ErrorMessage";
import { LoadingIndicator } from "../molecules/LoadingIndicator";

const useStyles = makeStyles(() => ({
  bodyContainer: {
    boxShadow:
      "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
    maxHeight: "60vh",
    minHeight: "40vh",
    overflow: "auto",
    padding: "1vh 25px",
  },
  paginationContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  loadingIndicatorContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    maxHeight: "60vh",
    minHeight: "40vh",
  },
  errorMessageContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    maxHeight: "60vh",
    minHeight: "40vh",
  },
}));
const UsersEditor = (): JSX.Element => {
  // TODO: save per_page to local state
  const [searchText, setSearchText] = useState(getURLParam("searchText") || "");
  const [perPage, setPerPage] = useState(Number(getURLParam("perPage")) || 20);
  const [page, setPage] = useState(Number(getURLParam("page")) || 1);
  const { getAccessTokenSilently } = useAuth0();
  const [error, setError] = useState<null | ErrorMessageProps>(null);

  const styles = useStyles();

  const pageForQuery = page - 1;
  const listUsers = async () => {
    permissionManager.OpenAPI.TOKEN = await getAccessTokenSilently();
    permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
    const listUsersRes = await permissionManager.UserService.listUsers(
      perPage,
      pageForQuery,
      searchText
    );
    return listUsersRes;
  };

  const listUsersQuery = ObjToParamString({
    page: pageForQuery,
    per_page: perPage,
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
    const listRolesRes = permissionManager.RoleService.listRoles(undefined, 0);
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
          const newTarget = await permissionManager.UserService.updateUser(
            target.user_id,
            {
              role_ids: target.roles.map(
                (role) => role.role_id as permissionManager.RoleModel["role_id"]
              ),
            }
          );
          const newUsers = prev?.users.map((user) =>
            user.user_id !== newTarget.user_id ? user : newTarget
          );
          return { ...prev, users: newUsers };
        } catch (error) {
          setError({
            reason: JSON.stringify(error),
            instruction: "please reload this page",
          });
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
    addURLParam({ page, perPage, searchText }, "replace");
  }, [page, perPage, searchText]);

  return (
    <div>
      <Spacer direction="vertical" size="3vh" />
      <ToolBar>
        <SearchForm
          onSearch={(newSearchText) => setSearchText(newSearchText)}
          defaultValue={searchText}
        />
        <Spacer direction="horizontal" size="15px" />
        <div>| per page component |</div>
        <Spacer direction="horizontal" size="15px" />
        <Button
          href="https://manage.auth0.com/dashboard/us/hdwlab-com/users"
          startIcon={<AddCircle />}
        >
          Add User
        </Button>
      </ToolBar>
      <Spacer direction="vertical" size="3vh" />
      {listUsersError || listRolesError ? (
        <div className={styles.errorMessageContainer}>
          <ErrorMessage
            reason={JSON.stringify(listUsersError || listRolesError)}
            instruction="please reload this page"
          />
        </div>
      ) : error ? (
        <ErrorMessage reason={error.reason} instruction={error.instruction} />
      ) : listUsersRes && listRolesRes ? (
        <>
          {listRolesRes.roles?.length === 0 ? (
            <div>
              <strong>No roles defined! please define role!</strong>
            </div>
          ) : null}
          <div className={styles.bodyContainer}>
            <UserList
              users={listUsersRes.users}
              roles={listRolesRes.roles}
              onUpdateUser={updateUser}
            />
          </div>
          <Spacer direction="vertical" size="3vh" />
          <div className={styles.paginationContainer}>
            <Pagination
              count={Math.ceil(listUsersRes.total / listUsersRes.per_page)}
              page={page}
              onChange={(e, newPage) => setPage(newPage)}
            />
          </div>
        </>
      ) : (
        <div className={styles.loadingIndicatorContainer}>
          <LoadingIndicator />
        </div>
      )}
    </div>
  );
};

export { UsersEditor };
