import AddCircle from "@material-ui/icons/AddCircle";
import Pagination from "@material-ui/core/Pagination";
import {
  API_ROUTE,
  Spacer,
  ObjToParamString,
  addURLParam,
  getURLParam,
} from "../../utils";
import { ToolBar } from "./ToolBar";
import { useState, useEffect } from "react";
import { RoleList } from "./RoleList";
import { RoleEditModal, RoleEditModalProps } from "./RoleEditModal";
import { useAuth0 } from "@auth0/auth0-react";
import {
  permissionManager,
  LoadingIndicator,
  ErrorMessage,
  ErrorMessageProps,
  PerPageSelect,
  SearchForm,
} from "@dataware-tools/app-common";
import useSWR, { mutate } from "swr";

import LoadingButton from "@material-ui/lab/LoadingButton";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  mainContainer: {
    boxShadow:
      "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
    maxHeight: "60vh",
    minHeight: "40vh",
    overflow: "auto",
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

const RolesEditor = (): JSX.Element => {
  // TODO: save per_page to local state
  const [searchText, setSearchText] = useState(getURLParam("searchText") || "");
  const [perPage, setPerPage] = useState(Number(getURLParam("perPage")) || 20);
  const [page, setPage] = useState(Number(getURLParam("page")) || 1);
  const [modalProps, setModalProps] = useState({
    open: false,
    roleId: undefined as undefined | RoleEditModalProps["roleId"],
    focusTarget: undefined as RoleEditModalProps["focusTarget"],
  });
  const [error, setError] = useState<undefined | ErrorMessageProps>(undefined);
  const { getAccessTokenSilently } = useAuth0();
  const rolesListColumns = [
    { field: "role_id", type: "number" as const },
    { field: "name", type: "string" as const },
    {
      field: "description",
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

  const listRolesQuery = ObjToParamString({
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
    addURLParam({ page, perPage, searchText }, "replace");
  }, [page, perPage, searchText]);

  const addRole = async () => {
    setModalProps({
      open: true,
      roleId: undefined,
      focusTarget: "roleName" as const,
    });
  };

  const onSaveModal: RoleEditModalProps["onSave"] = (newRole) => {
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
    <div>
      <Spacer direction="vertical" size="3vh" />
      <ToolBar>
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
      </ToolBar>
      <Spacer direction="vertical" size="3vh" />
      {listRolesError ? (
        <ErrorMessage
          reason={JSON.stringify(listRolesError)}
          instruction="please reload this page"
        />
      ) : error ? (
        <div className={styles.errorMessageContainer}>
          <ErrorMessage reason={error.reason} instruction={error.instruction} />
        </div>
      ) : listRolesRes ? (
        <>
          <div className={styles.mainContainer}>
            <RoleList
              rows={listRolesRes.roles}
              columns={rolesListColumns}
              stickyHeader
              onClickRow={(_, targetDetail) => {
                setModalProps({
                  open: true,
                  roleId: targetDetail.row
                    .role_id as permissionManager.RoleModel["role_id"],
                  focusTarget: undefined,
                });
              }}
              onDeleteRow={(_, targetDetail) => {
                deleteRole(
                  targetDetail.row
                    .role_id as permissionManager.RoleModel["role_id"]
                );
              }}
            />
            <RoleEditModal
              {...modalProps}
              onClose={onModalClose}
              onSave={onSaveModal}
            />
          </div>
          <Spacer direction="vertical" size="3vh" />
          <div className={styles.paginationContainer}>
            <Pagination
              page={page}
              count={Math.ceil(listRolesRes.total / listRolesRes.per_page)}
              onChange={(_, newPage) => setPage(newPage)}
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

export { RolesEditor };
