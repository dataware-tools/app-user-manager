import { databaseStore, permissionManager } from "@dataware-tools/app-common";
import LoadingButton from "@material-ui/lab/LoadingButton";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import { API_ROUTE, Spacer } from "../../utils";
import { useAuth0 } from "@auth0/auth0-react";
import { createRef, useState } from "react";
import { PermissionList, PermissionListProps } from "./PermissionList";
import { ToolBar } from "./ToolBar";
import useSWR, { mutate } from "swr";
import { ErrorMessage, ErrorMessageProps } from "../molecules/ErrorMessage";
import { LoadingIndicator } from "../molecules/LoadingIndicator";

const useStyles = makeStyles(() => ({
  formContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    overflow: "auto",
    padding: "0 3vw",
  },
  closeButton: {
    cursor: "pointer",
  },
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
    margin: "0 3vw",
  },
}));

type RoleEditModalProps = {
  open: boolean;
} & RoleEditModalBodyProps;

type RoleEditModalBodyProps = {
  focusTarget?: "roleName";
  onClose: () => void;
  onSave: (newRole: permissionManager.RoleModel) => Promise<void> | void;
  roleId?: number;
};

const RoleEditModalBody = ({
  focusTarget,
  onClose,
  onSave,
  roleId,
}: RoleEditModalBodyProps) => {
  const styles = useStyles();
  const roleNameRef = createRef<HTMLInputElement>();
  const descriptionRef = createRef<HTMLInputElement>();
  const { getAccessTokenSilently } = useAuth0();
  const [validationError, setValidationError] = useState(false);
  const [error, setError] = useState<null | ErrorMessageProps>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [permissions, setPermissions] = useState<
    PermissionListProps["permissions"] | null
  >(null);

  const listActions = async () => {
    permissionManager.OpenAPI.TOKEN = await getAccessTokenSilently();
    permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
    const listActionsRes = await permissionManager.ActionService.listActions();
    return listActionsRes;
  };
  const listActionsQuery = `per_page=0`;
  const listActionsURL = `${API_ROUTE.PERMISSION.BASE}/actions${listActionsQuery}`;
  const { data: actions, error: listActionsError } = useSWR(
    listActionsURL,
    listActions
  );

  const listDatabases = async () => {
    databaseStore.OpenAPI.TOKEN = await getAccessTokenSilently();
    databaseStore.OpenAPI.BASE = API_ROUTE.DATABASE.BASE;
    const listDatabaseRes = await databaseStore.DatabaseService.listDatabases();
    return listDatabaseRes;
  };
  const listDatabasesURL = `${API_ROUTE.PERMISSION.BASE}/databases`;
  const { data: databases, error: listDatabasesError } = useSWR(
    listDatabasesURL,
    listDatabases
  );

  const getRoleURL = `${API_ROUTE.PERMISSION.BASE}/roles/${roleId}`;
  const getRole = async () => {
    if (roleId) {
      permissionManager.OpenAPI.TOKEN = await getAccessTokenSilently();
      permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
      const getRoleRes = await permissionManager.RoleService.getRole(roleId);
      return getRoleRes;
    } else {
      setError({
        reason: "non expected state!",
        instruction: "please reload this page",
      });
      return undefined;
    }
  };
  // React hook only can be called at the Top Level from react function. See https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
  // So the code "const {data, error} = roleId ? useSWR(~~) : <DummyData>" is not suitable...
  // But below code also is not suitable, I think. Are there any other idea?
  let { data: role, error: getRoleError } = useSWR(
    roleId ? getRoleURL : null,
    getRole
  );
  role = !roleId
    ? {
        role_id: -999,
        name: "",
        description: "",
        permissions: [
          {
            databases: [],
            actions: [],
          },
        ] as permissionManager.RoleModel["permissions"],
      }
    : role;
  getRoleError = !roleId ? undefined : getRoleError;

  const saveRole = async (
    role:
      | permissionManager.UpdateRoleRequest
      | permissionManager.CreateRoleRequest
  ) => {
    mutate(getRoleURL, role, false);
    const requestBody = {
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    };

    const saveRoleRes = await mutate(getRoleURL, async () => {
      permissionManager.OpenAPI.TOKEN = await getAccessTokenSilently();
      permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
      const saveRoleRes = roleId
        ? await permissionManager.RoleService.updateRole(roleId, requestBody)
        : await permissionManager.RoleService.createRole(requestBody);
      return saveRoleRes;
    }).catch((error) => {
      setError({
        reason: JSON.stringify(error),
        instruction: "please reload this page",
      });
      return undefined;
    });

    return saveRoleRes;
  };

  const onClickSaveButton = async () => {
    if (roleNameRef.current && descriptionRef.current) {
      const name = roleNameRef.current.value;
      const description = descriptionRef.current.value;
      if (name !== "") {
        setValidationError(false);
        setIsSaving(true);

        if (role) {
          const convPermissions = (
            permissions: PermissionListProps["permissions"]
          ) => {
            return permissions.map((permission) => {
              return {
                databases: permission.databases,
                action_ids: permission.actions.map(
                  (action) => action.action_id
                ),
              };
            });
          };
          const newRole = {
            role_id: roleId,
            name,
            description,
            permissions: convPermissions(permissions || role.permissions),
          };
          const saveRoleRes = await saveRole(newRole);
          if (saveRoleRes) {
            onSave(saveRoleRes);
            setIsSaving(false);
            onClose();
          }
        } else {
          setError({
            reason: "non expected state!",
            instruction: "please reload this page",
          });
        }
      } else {
        alert("role name is required!");
        setValidationError(true);
      }
    } else {
      setError({
        reason: "non expected state!",
        instruction: "please reload this page",
      });
    }
  };

  return (
    <>
      <ToolBar>
        <CloseIcon
          className={styles.closeButton}
          onClick={() => {
            onClose();
          }}
          fontSize="large"
        />
      </ToolBar>
      {getRoleError || listDatabasesError || listActionsError ? (
        <ErrorMessage
          reason={JSON.stringify(
            getRoleError || listActionsError || listDatabasesError
          )}
          instruction="please reload this page"
        />
      ) : error ? (
        <ErrorMessage reason={error.reason} instruction={error.instruction} />
      ) : role && databases && actions ? (
        <>
          <div className={styles.formContainer}>
            <Spacer direction="vertical" size="2vh" />
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
              defaultValue={role.name}
              placeholder="Name"
              error={validationError}
              inputRef={roleNameRef}
            />
            <Spacer direction="vertical" size="1vh" />
            <div>
              <div className={styles.descriptionLabel}>Description</div>
              <div className={styles.descriptionInputContainer}>
                <TextField
                  fullWidth
                  inputRef={descriptionRef}
                  multiline
                  defaultValue={role.description}
                />
              </div>
            </div>
            <Spacer direction="vertical" size="1vh" />
            <PermissionList
              permissions={permissions || role.permissions}
              actions={actions.actions}
              databases={
                // TODO: fix API type
                databases.databases as NonNullable<typeof databases.databases>
              }
              onChange={(newPermissions) => setPermissions([...newPermissions])}
            />
          </div>
          <Spacer direction="vertical" size="2vh" />
          <ToolBar>
            <LoadingButton
              size="large"
              onClick={onClickSaveButton}
              pending={isSaving}
            >
              Save
            </LoadingButton>
            <Spacer direction="horizontal" size="2vw" />
          </ToolBar>
        </>
      ) : (
        <LoadingIndicator />
      )}
      <Spacer direction="vertical" size="2vh" />
    </>
  );
};

const RoleEditModal = ({
  focusTarget,
  onClose,
  onSave,
  open,
  roleId,
}: RoleEditModalProps): JSX.Element => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <RoleEditModalBody
        focusTarget={focusTarget}
        onClose={onClose}
        onSave={onSave}
        roleId={roleId}
      />
    </Dialog>
  );
};

export { RoleEditModal };
export type { RoleEditModalProps };
