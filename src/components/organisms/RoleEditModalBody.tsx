import {
  Spacer,
  DialogBody,
  DialogToolBar,
  DialogMain,
  NoticeableLetters,
  DialogSubTitle,
  metaStore,
  permissionManager,
} from "@dataware-tools/app-common";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { createRef, useState, RefObject } from "react";
import { PermissionList, PermissionListProps } from "./PermissionList";

export type RoleEditModalBodyPresentationProps = {
  initialRoleName?: string;
  initialRoleDescription?: string;
  onClickSaveButton: () => void;
  validationError: boolean;
  isSaving: boolean;
  roleNameRef: RefObject<HTMLInputElement>;
  roleDescriptionRef: RefObject<HTMLInputElement>;
  onChangePermissions: PermissionListProps["onChange"];
  permissions: PermissionListProps["permissions"];
} & Omit<
  RoleEditModalBodyProps,
  "roleId" | "onSave" | "onModalClose" | "initialRole"
>;

export type RoleEditModalBodyProps = {
  focusTarget?: "roleName";
  initialRole?: permissionManager.RoleModel;
  actions: permissionManager.ActionModel[];
  databases: metaStore.DatabaseModel[];
  onSave: (
    role:
      | permissionManager.UpdateRoleRequest
      | permissionManager.CreateRoleRequest
  ) => Promise<boolean>;
  onModalClose: () => void;
};

export const RoleEditModalBodyPresentation = ({
  focusTarget,
  initialRoleName,
  initialRoleDescription,
  permissions,
  actions,
  databases,
  onClickSaveButton,
  validationError,
  isSaving,
  roleNameRef,
  roleDescriptionRef,
  onChangePermissions,
}: RoleEditModalBodyPresentationProps): JSX.Element => {
  return (
    <DialogBody>
      <TextField
        variant="standard"
        required
        fullWidth
        autoFocus={focusTarget === "roleName"}
        InputProps={{
          sx: {
            fontSize: "1.7rem",
            fontWeight: "bolder",
            lineHeight: 1.5,
          },
        }}
        defaultValue={initialRoleName}
        placeholder="Name"
        error={validationError}
        inputRef={roleNameRef}
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
            <TextField
              fullWidth
              inputRef={roleDescriptionRef}
              multiline
              defaultValue={initialRoleDescription}
            />
          </Box>
        </div>
        <Spacer direction="vertical" size="1vh" />
        <PermissionList
          title={
            <DialogSubTitle>
              <NoticeableLetters>Permission</NoticeableLetters>
            </DialogSubTitle>
          }
          permissions={permissions}
          actions={actions}
          databases={databases}
          onChange={onChangePermissions}
        />
      </DialogMain>
      <DialogToolBar
        right={
          <LoadingButton
            size="large"
            onClick={onClickSaveButton}
            loading={isSaving}
          >
            Save
          </LoadingButton>
        }
      />
    </DialogBody>
  );
};

export const RoleEditModalBody = ({
  initialRole,
  onSave,
  onModalClose,
  ...delegated
}: RoleEditModalBodyProps): JSX.Element => {
  const roleNameRef = createRef<HTMLInputElement>();
  const roleDescriptionRef = createRef<HTMLInputElement>();

  const [permissions, setPermissions] = useState<
    PermissionListProps["permissions"]
  >(initialRole?.permissions || []);
  const [validationError, setValidationError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const onClickSaveButton = async () => {
    if (roleNameRef.current && roleDescriptionRef.current) {
      const name = roleNameRef.current.value;
      const description = roleDescriptionRef.current.value;
      if (name !== "") {
        setValidationError(false);
        setIsSaving(true);

        const newRole = {
          role_id: initialRole?.role_id,
          name,
          description,
          permissions: permissions.map((permission) => ({
            databases: permission.databases,
            action_ids: permission.actions.map((action) => action.action_id),
          })),
        };
        const isSuccessSubmit = await onSave(newRole);
        if (isSuccessSubmit) {
          setIsSaving(false);
          onModalClose();
        }
      } else {
        setValidationError(true);
      }
    }
  };

  const onChangePermissions: RoleEditModalBodyPresentationProps["onChangePermissions"] = (
    newPermissions
  ) => setPermissions([...newPermissions]);

  return (
    <RoleEditModalBodyPresentation
      roleNameRef={roleNameRef}
      initialRoleName={initialRole?.name}
      roleDescriptionRef={roleDescriptionRef}
      initialRoleDescription={initialRole?.description}
      permissions={permissions}
      validationError={validationError}
      isSaving={isSaving}
      onClickSaveButton={onClickSaveButton}
      onChangePermissions={onChangePermissions}
      {...delegated}
    />
  );
};
