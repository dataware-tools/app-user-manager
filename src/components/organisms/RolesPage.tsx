import { useAuth0 } from "@auth0/auth0-react";
import { permissionManager } from "@dataware-tools/api-permission-manager-client";
import {
  Spacer,
  addQueryString,
  getQueryString,
  LoadingIndicator,
  ErrorMessage,
  ErrorMessageProps,
  Table,
  PerPageSelect,
  SearchForm,
  PageToolBar,
  PageMain,
  PerPageSelectProps,
  SearchFormProps,
  TableProps,
  extractReasonFromFetchError,
  confirm,
} from "@dataware-tools/app-common";
import AddCircle from "@mui/icons-material/AddCircle";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Pagination, { PaginationProps } from "@mui/material/Pagination";
import { useState, useEffect } from "react";
import { useSWRConfig } from "swr";
import {
  RoleEditModal,
  RoleEditModalProps,
} from "components/organisms/RoleEditModal";
import { fetchPermissionManager, useListRoles } from "utils";

export type RolesPagePresentationProps = {
  searchText: SearchFormProps["value"];
  perPage: PerPageSelectProps["perPage"];
  perPageOptions: PerPageSelectProps["values"];
  roles?: TableProps["rows"];
  roleDisplayConfig: TableProps["columns"];
  editingRoleId: RoleEditModalProps["roleId"];
  isEditingRole: RoleEditModalProps["open"];
  page: PaginationProps["page"];
  totalPage: PaginationProps["count"];
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
  onSelectRole: (roleId: number) => void;
  onDeleteRole: (roleId: number) => void;
  onCancelRoleEdit: RoleEditModalProps["onClose"];
  onSuccessSaveRole: RoleEditModalProps["onSaveSucceeded"];
  onAddRole: () => void;
  onChangePerPage: PerPageSelectProps["setPerPage"];
  onChangeSearchText: SearchFormProps["onSearch"];
  onChangePage: (page: number) => void;
};

export const RolesPagePresentation = ({
  searchText,
  perPage,
  perPageOptions,
  roles,
  roleDisplayConfig,
  editingRoleId,
  isEditingRole,
  page,
  totalPage,
  error,
  isFetchComplete,
  onSelectRole,
  onDeleteRole,
  onCancelRoleEdit,
  onChangeSearchText,
  onChangePerPage,
  onSuccessSaveRole,
  onChangePage,
  onAddRole,
}: RolesPagePresentationProps): JSX.Element => {
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
            <LoadingButton startIcon={<AddCircle />} onClick={onAddRole}>
              Add Role
            </LoadingButton>
          </>
        }
      />
      <PageMain>
        {error ? (
          <ErrorMessage reason={error.reason} instruction={error.instruction} />
        ) : isFetchComplete && roles ? (
          <>
            <Table
              rows={roles}
              columns={roleDisplayConfig}
              stickyHeader
              disableHoverCell
              onClickRow={(targetDetail) =>
                onSelectRole(targetDetail.row.role_id as number)
              }
              onDeleteRow={(targetDetail) =>
                onDeleteRole(targetDetail.row.role_id as number)
              }
            />
            <RoleEditModal
              open={isEditingRole}
              roleId={editingRoleId}
              onClose={onCancelRoleEdit}
              onSaveSucceeded={onSuccessSaveRole}
            />
          </>
        ) : (
          <LoadingIndicator />
        )}
      </PageMain>
      {isFetchComplete ? (
        <>
          <Spacer direction="vertical" size="1vh" />
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              count={totalPage}
              page={page}
              onChange={(_, page) => onChangePage(page)}
            />
          </Box>
        </>
      ) : null}
    </>
  );
};

export const RolesPage = (): JSX.Element => {
  const { mutate } = useSWRConfig();
  // TODO: save per_page to local state
  const [searchText, setSearchText] = useState(
    getQueryString("searchText") || ""
  );
  const [perPage, setPerPage] = useState(
    Number(getQueryString("perPage")) || 20
  );
  const [page, setPage] = useState(Number(getQueryString("page")) || 1);
  const [error, setError] = useState<undefined | ErrorMessageProps>(undefined);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<undefined | number>(
    undefined
  );
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [listRolesRes, listRolesError, listRolesCacheKey] = useListRoles(
    getAccessToken,
    {
      page,
      perPage,
      search: searchText,
    }
  );

  useEffect(() => {
    addQueryString({ page, perPage, searchText }, "replace");
  }, [page, perPage, searchText]);

  const fetchError = listRolesError;
  useEffect(() => {
    if (fetchError) {
      setError({
        reason: extractReasonFromFetchError(fetchError),
        instruction: "Please reload thi page",
      });
    }
  }, [fetchError]);

  const roleDisplayConfig = [
    { field: "role_id", label: "Role ID", type: "number" as const },
    { field: "name", label: "Name", type: "string" as const },
    {
      field: "description",
      label: "Description",
      type: "string" as const,
      ifEmpty: "No description...",
    },
  ];

  const onSelectRole = (roleId: number) => {
    setIsEditingRole(true);
    setEditingRoleId(roleId);
  };
  const onAddRole = () => {
    setIsEditingRole(true);
    setEditingRoleId(undefined);
  };

  const onDeleteRole = async (roleId: number) => {
    if (
      !(await confirm({
        title: "Are you sure you want to delete role?",
        confirmMode: "delete",
      }))
    )
      return;

    const prev = listRolesRes;
    const newLocalRoles = prev?.roles.filter((role) => role.role_id !== roleId);
    mutate(
      listRolesCacheKey,
      {
        ...prev,
        roles: newLocalRoles,
      },
      false
    );

    const [, deleteRoleError] = await fetchPermissionManager(
      getAccessToken,
      permissionManager.RoleService.deleteRole,
      { roleId }
    );

    if (deleteRoleError) {
      setError({
        reason: extractReasonFromFetchError(deleteRoleError),
        instruction: "Please reload this page",
      });
    } else {
      mutate(listRolesCacheKey);
    }
  };

  const onSuccessSaveRole: RoleEditModalProps["onSaveSucceeded"] = (
    newRole
  ) => {
    const prev = listRolesRes;
    if (prev?.roles.find((role) => role.role_id === newRole.role_id)) {
      const newLocalRoles = prev?.roles.map((role) =>
        role.role_id === newRole.role_id ? newRole : role
      );
      mutate(listRolesCacheKey, {
        ...prev,
        roles: newLocalRoles,
      });
    } else {
      const newLocalRoles = [...(prev as NonNullable<typeof prev>).roles];
      newLocalRoles.push(newRole);
      mutate(listRolesCacheKey, { ...prev, roles: newLocalRoles });
    }
  };

  const onCancelRoleEdit = () => {
    setIsEditingRole(false);
    setEditingRoleId(undefined);
  };

  const onChangePerPage = (perPage: number) => {
    setPerPage(perPage);
    setPage(1);
  };

  const onChangeSearchText = (searchText?: string) => {
    setSearchText(searchText || "");
    setPage(1);
  };

  const isFetchComplete = Boolean(!fetchError && listRolesRes);
  const totalPage = listRolesRes
    ? Math.ceil(listRolesRes.total / listRolesRes.per_page)
    : 0;

  return (
    <RolesPagePresentation
      error={error}
      isFetchComplete={isFetchComplete}
      isEditingRole={isEditingRole}
      roleDisplayConfig={roleDisplayConfig}
      editingRoleId={editingRoleId}
      page={page}
      totalPage={totalPage}
      perPage={perPage}
      perPageOptions={[10, 20, 50, 100]}
      onChangePage={setPage}
      onChangePerPage={onChangePerPage}
      onChangeSearchText={onChangeSearchText}
      onDeleteRole={onDeleteRole}
      onSelectRole={onSelectRole}
      onSuccessSaveRole={onSuccessSaveRole}
      searchText={searchText}
      roles={listRolesRes?.roles}
      onCancelRoleEdit={onCancelRoleEdit}
      onAddRole={onAddRole}
    />
  );
};
