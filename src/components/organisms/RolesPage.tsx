import AddCircle from "@material-ui/icons/AddCircle";
import Pagination from "@material-ui/core/Pagination";
import { useState, useEffect } from "react";
import { RoleEditModal, RoleEditModalProps } from "./RoleEditModal";
import { useAuth0 } from "@auth0/auth0-react";
import {
  API_ROUTE,
  Spacer,
  objToQueryString,
  addQueryString,
  getQueryString,
  permissionManager,
  LoadingIndicator,
  ErrorMessage,
  ErrorMessageProps,
  Table,
  PerPageSelect,
  SearchForm,
  PageToolBar,
  PageMain,
} from "@dataware-tools/app-common";
import useSWR, { mutate } from "swr";

import LoadingButton from "@material-ui/lab/LoadingButton";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "0 3vw",
  },
  paginationContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
}));

const Container = (): JSX.Element => {
  // TODO: save per_page to local state
  const [searchText, setSearchText] = useState(
    getQueryString("searchText") || ""
  );
  const [perPage, setPerPage] = useState(
    Number(getQueryString("perPage")) || 20
  );
  const [page, setPage] = useState(Number(getQueryString("page")) || 1);
  const [modalProps, setModalProps] = useState({
    open: false,
    roleId: undefined as undefined | RoleEditModalProps["roleId"],
    focusTarget: undefined as RoleEditModalProps["focusTarget"],
  });
  const [error, setError] = useState<undefined | ErrorMessageProps>(undefined);
  const { getAccessTokenSilently } = useAuth0();
  const rolesListColumns = [
    { field: "role_id", label: "Role ID", type: "number" as const },
    { field: "name", label: "Name", type: "string" as const },
    {
      field: "description",
      label: "Description",
      type: "string" as const,
      ifEmpty: "No description...",
    },
  ];

  const styles = useStyles();

  const pageForQuery = page - 1;

  const listRoles = async () => {
    permissionManager.OpenAPI.TOKEN = await getAccessTokenSilently();
    permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
    const listRolesRes = await permissionManager.RoleService.listRoles({
      page: page,
      perPage: perPage,
      search: searchText,
    });
    return listRolesRes;
  };

  const listRolesQuery = objToQueryString({
    page: pageForQuery,
    per_page: perPage,
    search_text: searchText,
  });
  const listRolesURL = `${API_ROUTE.PERMISSION.BASE}/roles${listRolesQuery}`;
  const { data: listRolesRes, error: listRolesError } = useSWR(
    listRolesURL,
    listRoles
  );

  const deleteRole = (roleId: number) => {
    const prev = listRolesRes;
    const newLocalRoles = prev?.roles.filter((role) => role.role_id !== roleId);
    mutate(
      listRolesURL,
      {
        ...prev,
        roles: newLocalRoles,
      },
      false
    );

    try {
      mutate(listRolesURL, async () => {
        try {
          permissionManager.OpenAPI.TOKEN = await getAccessTokenSilently();
          permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
          await permissionManager.RoleService.deleteRole({ roleId: roleId });

          const newRoles = prev?.roles?.filter(
            (role) => role.role_id !== roleId
          );
          return { ...prev, roles: newRoles };
        } catch (error) {
          setError({
            reason: "failed to delete roles",
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

  const addRole = async () => {
    setModalProps({
      open: true,
      roleId: undefined,
      focusTarget: "roleName" as const,
    });
  };

  const onSaveRoleSucceeded: RoleEditModalProps["onSaveSucceeded"] = (
    newRole
  ) => {
    const prev = listRolesRes;
    if (prev?.roles.find((role) => role.role_id === newRole.role_id)) {
      const newLocalRoles = prev?.roles.map((role) =>
        role.role_id === newRole.role_id ? newRole : role
      );
      mutate(listRolesURL, {
        ...prev,
        roles: newLocalRoles,
      });
    } else {
      const newLocalRoles = [...(prev as NonNullable<typeof prev>).roles];
      newLocalRoles.push(newRole);
      mutate(listRolesURL, { ...prev, roles: newLocalRoles });
    }
  };

  const onModalClose = () => {
    setModalProps((prev) => ({ ...prev, open: false }));
  };

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
            <LoadingButton startIcon={<AddCircle />} onClick={addRole}>
              Add Role
            </LoadingButton>
          </>
        }
      />
      <PageMain>
        {listRolesError ? (
          <ErrorMessage
            reason={JSON.stringify(listRolesError)}
            instruction="please reload this page"
          />
        ) : error ? (
          <ErrorMessage reason={error.reason} instruction={error.instruction} />
        ) : listRolesRes ? (
          <>
            <Table
              rows={listRolesRes.roles}
              columns={rolesListColumns}
              stickyHeader
              disableHoverCell
              onClickRow={(targetDetail) => {
                setModalProps({
                  open: true,
                  roleId: targetDetail.row
                    .role_id as permissionManager.RoleModel["role_id"],
                  focusTarget: undefined,
                });
              }}
              onDeleteRow={(targetDetail) => {
                deleteRole(
                  targetDetail.row
                    .role_id as permissionManager.RoleModel["role_id"]
                );
              }}
            />
            <RoleEditModal
              {...modalProps}
              onClose={onModalClose}
              onSaveSucceeded={onSaveRoleSucceeded}
            />
          </>
        ) : (
          <LoadingIndicator />
        )}
      </PageMain>
      {listRolesRes ? (
        <>
          <Spacer direction="vertical" size="1vh" />
          <div className={styles.paginationContainer}>
            <Pagination
              page={page}
              count={Math.ceil(listRolesRes.total / listRolesRes.per_page)}
              onChange={(_, newPage) => setPage(newPage)}
            />
          </div>
        </>
      ) : null}
    </>
  );
};

export { Container as RolesPage };
