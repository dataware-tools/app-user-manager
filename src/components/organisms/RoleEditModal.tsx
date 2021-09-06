import { useAuth0 } from "@auth0/auth0-react";
import {
  permissionManager,
  LoadingIndicator,
  ErrorMessage,
  ErrorMessageProps,
  API_ROUTE,
  Spacer,
  DialogContainer,
  DialogCloseButton,
  DialogWrapper,
  usePrevious,
  extractReasonFromFetchError,
} from "@dataware-tools/app-common";
import Dialog from "@material-ui/core/Dialog";
import { useState, useEffect } from "react";
import { mutate } from "swr";
import { RoleEditModalBody, RoleEditModalBodyProps } from "./RoleEditModalBody";
import { useGetRole, useListActions, useListDatabases } from "utils";

export type RoleEditModalPresentationProps = {
  error?: ErrorMessageProps;
  roleEditModalBodyProps: RoleEditModalBodyProps;
  isFetchComplete: boolean;
} & Omit<RoleEditModalProps, "focusTarget" | "onSaveSucceeded" | "roleId">;

export type RoleEditModalProps = {
  open: boolean;
  focusTarget?: "roleName";
  onClose: () => void;
  onSaveSucceeded: (
    newRole: permissionManager.RoleModel
  ) => Promise<void> | void;
  roleId?: number;
};

export const RoleEditModalPresentation = ({
  open,
  onClose,
  error,
  roleEditModalBodyProps,
  isFetchComplete,
}: RoleEditModalPresentationProps): JSX.Element => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogContainer padding="0 0 20px">
          {error ? (
            <ErrorMessage
              reason={error.reason}
              instruction={error.instruction}
            />
          ) : isFetchComplete ? (
            <RoleEditModalBody {...roleEditModalBodyProps} />
          ) : (
            <LoadingIndicator />
          )}
          <Spacer direction="vertical" size="2vh" />
        </DialogContainer>
      </DialogWrapper>
    </Dialog>
  );
};

export const RoleEditModal = ({
  open,
  focusTarget,
  onClose,
  onSaveSucceeded,
  roleId,
}: RoleEditModalProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [error, setError] = useState<undefined | ErrorMessageProps>(undefined);

  const initializeState = () => {
    setError(undefined);
  };
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const [listActionsRes, listActionsError] = useListActions(getAccessToken, {});
  const [listDatabasesRes, listDatabasesError] = useListDatabases(
    getAccessToken,
    {}
  );
  const [getRoleRes, getRoleError, getRoleCacheKey] = useGetRole(
    getAccessToken,
    { roleId }
  );
  const fetchError = listActionsError || listDatabasesError || getRoleError;
  const isFetchComplete = Boolean(
    !fetchError &&
      listActionsRes &&
      listDatabasesRes &&
      (roleId ? getRoleRes : true)
  );

  const onSaveRole = async (
    role:
      | permissionManager.UpdateRoleRequest
      | permissionManager.CreateRoleRequest
  ) => {
    mutate(getRoleCacheKey, role, false);
    const requestBody = {
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    };

    permissionManager.OpenAPI.TOKEN = await getAccessToken();
    permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
    const setError = (error: any) => {
      setError({
        reason: extractReasonFromFetchError(error),
        instruction: "Please reload this page",
      });
      return undefined;
    };
    const saveRoleRes = roleId
      ? await permissionManager.RoleService.updateRole({
          roleId: roleId,
          requestBody: requestBody,
        }).catch(setError)
      : await permissionManager.RoleService.createRole({
          requestBody: requestBody,
        }).catch(setError);

    if (saveRoleRes) {
      onSaveSucceeded(saveRoleRes);
      mutate(getRoleCacheKey);
    }

    return Boolean(saveRoleRes);
  };

  useEffect(() => {
    if (fetchError) {
      setError({
        reason: extractReasonFromFetchError(fetchError),
        instruction: "Please reload this page",
      });
    }
  }, [fetchError]);

  const roleEditModalBodyProps: RoleEditModalPresentationProps["roleEditModalBodyProps"] = {
    actions: listActionsRes?.actions || [],
    databases: listDatabasesRes?.data || [],
    onModalClose: onClose,
    onSave: onSaveRole,
    focusTarget: focusTarget,
    initialRole: getRoleRes,
  };
  return (
    <RoleEditModalPresentation
      open={open}
      error={error}
      isFetchComplete={isFetchComplete}
      roleEditModalBodyProps={roleEditModalBodyProps}
      onClose={onClose}
    />
  );
};
