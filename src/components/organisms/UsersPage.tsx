import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { mutate } from "swr";
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
  addQueryString,
  PageMain,
  SearchFormProps,
  PerPageSelectProps,
  extractReasonFromFetchError,
} from "@dataware-tools/app-common";

import { makeStyles } from "@material-ui/core/styles";
import AddCircle from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import Pagination from "@material-ui/core/Pagination";

import { UserList, UserListProps } from "./UserList";
import { useListUsers, useListRoles, fetchPermissionManager } from "utils";

type Props = {
  classes: ReturnType<typeof useStyles>;
  error?: ErrorMessageProps;
  searchText: SearchFormProps["defaultValue"];
  perPage: PerPageSelectProps["perPage"];
  perPageOptions: PerPageSelectProps["values"];
  users?: UserListProps["users"];
  roles?: UserListProps["roles"];
  isFetchComplete: boolean;
  totalPage: number;
  page: number;
  onChangeSearchText: SearchFormProps["onSearch"];
  onChangePerPage: PerPageSelectProps["setPerPage"];
  onSaveUser: UserListProps["onUpdateUser"];
  onChangePage: (newPage: number) => void;
};

const Component = ({
  classes,
  error,
  searchText,
  perPage,
  perPageOptions,
  isFetchComplete,
  users,
  roles,
  totalPage,
  page,
  onChangeSearchText,
  onChangePerPage,
  onSaveUser,
  onChangePage,
}: Props) => {
  return (
    <>
      <PageToolBar
        right={
          <>
            <SearchForm
              onSearch={onChangeSearchText}
              defaultValue={searchText}
            />
            <Spacer direction="horizontal" size="15px" />
            <PerPageSelect
              perPage={perPage}
              setPerPage={onChangePerPage}
              values={perPageOptions}
            />
            <Spacer direction="horizontal" size="15px" />
            <Button
              href={
                process.env.NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_MANAGE_PAGE ||
                "https://manage.auth0.com/dashboard/us/dataware-tools/users"
              }
              startIcon={<AddCircle />}
            >
              Add User
            </Button>
          </>
        }
      />
      <PageMain>
        {error ? (
          <ErrorMessage reason={error.reason} instruction={error.instruction} />
        ) : isFetchComplete && users && roles ? (
          <UserList users={users} roles={roles} onUpdateUser={onSaveUser} />
        ) : (
          <LoadingIndicator />
        )}
      </PageMain>
      <Spacer direction="vertical" size="1vh" />
      {isFetchComplete ? (
        <div className={classes.paginationContainer}>
          <Pagination
            count={totalPage}
            page={page}
            onChange={(_, newPage) => onChangePage(newPage)}
          />
        </div>
      ) : null}
    </>
  );
};

const useStyles = makeStyles(() => ({
  paginationContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
}));

const Container = (): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const classes = useStyles();

  // TODO: save per_page to local state
  const [searchText, setSearchText] = useState(
    getQueryString("searchText") || ""
  );
  const [perPage, setPerPage] = useState(
    Number(getQueryString("perPage")) || 20
  );
  const [page, setPage] = useState(Number(getQueryString("page")) || 1);
  const [error, setError] = useState<undefined | ErrorMessageProps>(undefined);

  const [listUsersRes, listUsersError, listUsersCacheKey] = useListUsers(
    getAccessToken,
    {
      page,
      perPage,
      search: searchText,
    }
  );
  const [listRolesRes, listRolesError] = useListRoles(getAccessToken, {
    perPage: 0,
  });

  const fetchError = listUsersError || listRolesError;
  useEffect(() => {
    if (fetchError) {
      setError({
        reason: extractReasonFromFetchError(fetchError),
        instruction: "Please reload this page",
      });
    }
  }, [fetchError]);
  useEffect(() => {
    addQueryString({ page, perPage, searchText }, "replace");
  }, [page, perPage, searchText]);

  const onSaveUser: UserListProps["onUpdateUser"] = (target) => {
    // update cache by local data
    const prev = listUsersRes;
    const newLocalUsers = prev?.users.map((user) =>
      user.user_id === target.user_id ? target : user
    );
    mutate(listUsersCacheKey, { ...prev, users: newLocalUsers }, false);

    const updateUser = async () => {
      const [updateUserRes, updateUserError] = await fetchPermissionManager(
        getAccessToken,
        permissionManager.UserService.updateUser,
        {
          userId: target.user_id,
          requestBody: {
            role_ids: target.roles.map(
              (role) => role.role_id as permissionManager.RoleModel["role_id"]
            ),
          },
        }
      );

      if (updateUserError) {
        setError({
          reason: extractReasonFromFetchError(updateUserError),
          instruction: "Please reload this page",
        });
        return undefined;
      } else if (updateUserRes) {
        const newUsers = prev?.users.map((user) =>
          user.user_id === updateUserRes?.user_id ? updateUserRes : user
        );

        return { ...prev, users: newUsers };
      }
      return undefined;
    };

    mutate(listUsersCacheKey, updateUser);
  };

  const isFetchComplete = Boolean(!fetchError && listUsersRes && listRolesRes);
  const totalCount = listUsersRes
    ? Math.ceil(listUsersRes.total / listUsersRes.per_page)
    : 0;

  return (
    <Component
      classes={classes}
      error={error}
      isFetchComplete={isFetchComplete}
      onChangePage={setPage}
      onChangePerPage={setPerPage}
      onChangeSearchText={setSearchText}
      onSaveUser={onSaveUser}
      page={page}
      perPage={perPage}
      perPageOptions={[10, 20, 50, 100]}
      roles={listRolesRes?.roles}
      users={listUsersRes?.users}
      searchText={searchText}
      totalPage={totalCount}
    />
  );
};

export { Container as UsersPage };
