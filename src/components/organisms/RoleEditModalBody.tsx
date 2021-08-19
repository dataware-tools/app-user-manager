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
import TextField from "@material-ui/core/TextField";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { makeStyles } from "@material-ui/styles";
import { createRef, useState, RefObject } from "react";
import { PermissionList, PermissionListProps } from "./PermissionList";

type Props = {
  classes: ReturnType<typeof useStyles>;
  initialRoleName?: string;
  initialRoleDescription?: string;
  onClickSaveButton: () => void;
  validationError: boolean;
  isSaving: boolean;
  roleNameRef: RefObject<HTMLInputElement>;
  roleDescriptionRef: RefObject<HTMLInputElement>;
  onChangePermissions: PermissionListProps["onChange"];
  permissions: PermissionListProps["permissions"];
} & Omit<ContainerProps, "roleId" | "onSave" | "onModalClose" | "initialRole">;

type ContainerProps = {
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

const Component = ({
  classes,
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
}: Props): JSX.Element => {
  return (
    <DialogBody>
      <TextField
        variant="standard"
        required
        fullWidth
        autoFocus={focusTarget === "roleName"}
        InputProps={{
          style: {
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
          <div className={classes.descriptionInputContainer}>
            <TextField
              fullWidth
              inputRef={roleDescriptionRef}
              multiline
              defaultValue={initialRoleDescription}
            />
          </div>
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

const useStyles = makeStyles(() => ({
  roleNameInput: {
    fontSize: "2rem",
    fontWeight: "bold",
    lineHeight: 1.5,
  },
  descriptionLabel: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    lineHeight: 2,
  },
  descriptionInputContainer: {
    padding: "0 3vw",
  },
}));

const Container = ({
  initialRole,
  onSave,
  onModalClose,
  ...delegated
}: ContainerProps): JSX.Element => {
  const classes = useStyles();
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

  const onChangePermissions: Props["onChangePermissions"] = (newPermissions) =>
    setPermissions([...newPermissions]);

  return (
    <Component
      classes={classes}
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

export { Container as RoleEditModalBody };
export type { ContainerProps as RoleEditModalBodyProps };
