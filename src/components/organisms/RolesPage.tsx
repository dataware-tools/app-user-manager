import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Spacer,
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
  PerPageSelectProps,
  SearchFormProps,
  TableProps,
} from "@dataware-tools/app-common";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { makeStyles } from "@material-ui/core/styles";
import AddCircle from "@material-ui/icons/AddCircle";
import Pagination, { PaginationProps } from "@material-ui/core/Pagination";
import { mutate } from "swr";
import { fetchPermissionManager, useListRoles } from "utils";
import {
  RoleEditModal,
  RoleEditModalProps,
} from "components/organisms/RoleEditModal";

type Props = {
  classes: ReturnType<typeof useStyles>;
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

const Component = ({
  classes,
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
          <div className={classes.paginationContainer}>
            <Pagination
              count={totalPage}
              page={page}
              onChange={(_, page) => onChangePage(page)}
            />
          </div>
        </>
      ) : null}
    </>
  );
};

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
  const [error, setError] = useState<undefined | ErrorMessageProps>(undefined);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<undefined | number>(
    undefined
  );
  const classes = useStyles();
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
        reason: JSON.stringify(fetchError),
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
        reason: JSON.stringify(deleteRoleError),
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

  const isFetchComplete = Boolean(!fetchError && listRolesRes);
  const totalPage = listRolesRes
    ? Math.ceil(listRolesRes.total / listRolesRes.per_page)
    : 0;

  return (
    <Component
      classes={classes}
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
      onChangePerPage={setPerPage}
      onChangeSearchText={setSearchText}
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

export { Container as RolesPage };