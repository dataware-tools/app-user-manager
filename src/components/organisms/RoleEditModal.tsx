import { useAuth0 } from "@auth0/auth0-react";

import { metaStore } from "@dataware-tools/api-meta-store-client";
import { permissionManager } from "@dataware-tools/api-permission-manager-client";
import {
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
  DialogBody,
  DialogToolBar,
  DialogMain,
  NoticeableLetters,
  DialogSubTitle,
  confirm,
  useConfirmClosingWindow,
} from "@dataware-tools/app-common";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import equal from "fast-deep-equal";
import { useState, useEffect } from "react";
import { useForm, Controller, Control, ControllerProps } from "react-hook-form";
import { useSWRConfig } from "swr";
import { PermissionList, PermissionListProps } from "./PermissionList";
import {
  enqueueErrorToastForFetchError,
  useGetRole,
  useListActions,
  useListDatabases,
} from "utils";

type ValidateRuleType = ControllerProps["rules"];
export type FormType = {
  name: string;
  description: string;
  permissions: PermissionListProps["permissions"];
};
export type RoleEditModalPresentationProps = {
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
  actions: permissionManager.ActionModel[];
  databases: metaStore.DatabaseModel[];
  onSave: () => void;
  formControl: Control<FormType>;
  validateRules: Record<keyof FormType, ValidateRuleType>;
  isSaving: boolean;
} & Omit<RoleEditModalProps, "focusTarget" | "onSaveSucceeded" | "roleId">;

export type RoleEditModalProps = {
  open: boolean;
  onClose: (reason?: string) => void;
  onSaveSucceeded: (
    newRole: permissionManager.RoleModel
  ) => Promise<void> | void;
  roleId?: number;
};

export const RoleEditModalPresentation = ({
  open,
  onClose,
  error,
  isFetchComplete,
  isSaving,
  actions,
  databases,
  formControl,
  onSave,
  validateRules,
}: RoleEditModalPresentationProps): JSX.Element => {
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => onClose(reason)}
      maxWidth="xl"
      fullWidth
    >
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogContainer padding="0 0 20px">
          {error ? (
            <ErrorMessage
              reason={error.reason}
              instruction={error.instruction}
            />
          ) : isFetchComplete ? (
            <DialogBody>
              <Controller
                control={formControl}
                rules={validateRules.name}
                name="name"
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="standard"
                    required
                    fullWidth
                    InputProps={{
                      sx: {
                        fontSize: "1.7rem",
                        fontWeight: "bolder",
                        lineHeight: 1.5,
                      },
                    }}
                    placeholder="Name"
                    error={Boolean(error)}
                    helperText={error?.message}
                  />
                )}
              />
              <Spacer direction="vertical" size="1vh" />
              <DialogMain>
                <div>
                  <DialogSubTitle>
                    <NoticeableLetters>Description</NoticeableLetters>
                  </DialogSubTitle>
                  <Box
                    sx={{
                      padding: "0 3vw",
                    }}
                  >
                    <Controller
                      control={formControl}
                      rules={validateRules.description}
                      name="description"
                      render={({ field }) => (
                        <TextField {...field} fullWidth multiline />
                      )}
                    />
                  </Box>
                </div>
                <Spacer direction="vertical" size="1vh" />
                <Controller
                  control={formControl}
                  rules={validateRules.permissions}
                  name="permissions"
                  render={({ field: { value, onChange } }) => (
                    <PermissionList
                      title={
                        <DialogSubTitle>
                          <NoticeableLetters>Permission</NoticeableLetters>
                        </DialogSubTitle>
                      }
                      permissions={value}
                      actions={actions}
                      databases={databases}
                      onChange={onChange}
                    />
                  )}
                />
              </DialogMain>
              <DialogToolBar
                right={
                  <LoadingButton
                    size="large"
                    onClick={onSave}
                    loading={isSaving}
                  >
                    Save
                  </LoadingButton>
                }
              />
            </DialogBody>
          ) : (
            <LoadingIndicator />
          )}
          <Spacer direction="vertical" size="2vh" />
        </DialogContainer>
      </DialogWrapper>
    </Dialog>
  );
};

const initialDummyRole = { permissions: [], name: "", description: "" };
export const RoleEditModal = ({
  open,
  onClose: propsOnClose,
  onSaveSucceeded,
  roleId,
}: RoleEditModalProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const { mutate } = useSWRConfig();
  const [error, setError] = useState<undefined | ErrorMessageProps>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const [listActionsRes, listActionsError] = useListActions(getAccessToken, {});
  const [listDatabasesRes, listDatabasesError] = useListDatabases(
    getAccessToken,
    {}
  );
  const [getRoleRes, getRoleError, getRoleCacheKey] = useGetRole(
    getAccessToken,
    { roleId }
  );

  const { control, handleSubmit, reset, getValues } = useForm<FormType>({
    defaultValues: getRoleRes || initialDummyRole,
  });

  const fetchError = listActionsError || listDatabasesError || getRoleError;
  const isFetchComplete = Boolean(
    !fetchError &&
      listActionsRes &&
      listDatabasesRes &&
      (roleId ? getRoleRes : true)
  );
  const {
    addEventListener: addEventListenerForConfirmClosingWindow,
    removeEventListener: removeEventListenerForConfirmClosingWindow,
  } = useConfirmClosingWindow(() => {
    if (
      !roleId &&
      Object.values(getValues()).some((value) => {
        if (Array.isArray(value)) {
          return value.length !== 0;
        } else {
          return value !== "" && value != null;
        }
      })
    ) {
      return true;
    } else if (!roleId && getRoleRes && !equal(getRoleRes, getValues())) {
      return true;
    }

    return false;
  });

  // When modal is opened, state should be initialized
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      setError(undefined);
      reset(initialDummyRole);
      addEventListenerForConfirmClosingWindow();
    }
  }, [open, prevOpen, reset]);

  // When succeed fetch, form value should be reset
  useEffect(() => {
    reset(getRoleRes);
  }, [getRoleRes, reset]);

  // When fail fetch , error should be shown
  useEffect(() => {
    if (fetchError) {
      setError({
        reason: extractReasonFromFetchError(fetchError),
        instruction: "Please reload this page",
      });
    }
  }, [fetchError]);

  const onSaveRole = handleSubmit(async (formValues) => {
    setIsSaving(true);
    mutate(getRoleCacheKey, formValues, false);

    const newRole = {
      name: formValues.name,
      description: formValues.description,
      permissions: formValues.permissions.map((permission) => ({
        databases: permission.databases,
        action_ids: permission.actions.map((action) => action.action_id),
      })),
    };

    permissionManager.OpenAPI.TOKEN = await getAccessToken();
    permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
    const saveRoleRes = roleId
      ? await permissionManager.RoleService.updateRole({
          roleId,
          requestBody: newRole,
        }).catch((e: any) =>
          enqueueErrorToastForFetchError("Failed to update role", e)
        )
      : await permissionManager.RoleService.createRole({
          requestBody: newRole,
        }).catch((e: any) =>
          enqueueErrorToastForFetchError("Failed to create role", e)
        );

    if (saveRoleRes) {
      onSaveSucceeded(saveRoleRes);
      mutate(getRoleCacheKey);
      propsOnClose();
    }

    setIsSaving(false);
  });

  const onClose = async (reason?: string) => {
    const confirmClosingModal = async () => {
      return await confirm({
        title: "Are you sure you want close this dialog?",
        body: "Changed data will not be saved",
        confirmText: "Close",
        confirmMode: "delete",
      });
    };

    console.log(getValues());
    switch (reason) {
      case "backdropClick":
      case "escapeKeyDown":
        if (roleId && !equal(getRoleRes, getValues())) {
          if (!(await confirmClosingModal())) {
            return;
          }
        } else if (
          !roleId &&
          Object.values(getValues()).some((value) => {
            if (Array.isArray(value)) {
              return value.length !== 0;
            } else {
              return value !== "" && value != null;
            }
          })
        ) {
          if (!(await confirmClosingModal())) {
            return;
          }
        }
        removeEventListenerForConfirmClosingWindow();
        propsOnClose();
        break;

      default:
        removeEventListenerForConfirmClosingWindow();
        propsOnClose();
    }
  };

  const validateRules: RoleEditModalPresentationProps["validateRules"] = {
    name: { required: "Role name is required" },
    description: {},
    permissions: {},
  };
  return (
    <RoleEditModalPresentation
      open={open}
      error={error}
      isFetchComplete={isFetchComplete}
      onClose={onClose}
      isSaving={isSaving}
      actions={listActionsRes?.actions || []}
      databases={listDatabasesRes?.data || []}
      formControl={control}
      validateRules={validateRules}
      onSave={onSaveRole}
    />
  );
};
