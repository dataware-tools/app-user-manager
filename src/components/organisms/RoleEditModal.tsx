import { databaseStore, permissionManager } from "@dataware-tools/app-common";
import Container from "@material-ui/core/Container";
import LoadingButton from "@material-ui/lab/LoadingButton";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import { API_ROUTE, Spacer, isNonNullable } from "../../utils";
import { useAuth0 } from "@auth0/auth0-react";
import { createRef, useState, forwardRef } from "react";
import { PermissionList, PermissionListProps } from "./PermissionList";
import { ToolBar } from "./ToolBar";
import useSWR, { mutate } from "swr";
import { ErrorMessage, ErrorMessageProps } from "../molecules/ErrorMessage";
import { LoadingIndicator } from "../molecules/LoadingIndicator";

const useStyles = makeStyles(() => ({
  modal: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    height: "90%",
    padding: "10px",
    width: "90%",
  },
  formContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    marginBottom: "1vh",
    marginTop: "3vh",
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
  descriptionInput: {
    display: "block",
    marginBottom: "10px",
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

const RoleEditModalBody = forwardRef(
  ({ focusTarget, onClose, onSave, roleId }: RoleEditModalBodyProps, ref) => {
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
      if (isNonNullable(roleId)) {
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
        try {
          permissionManager.OpenAPI.TOKEN = await getAccessTokenSilently();
          permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
          const saveRoleRes = roleId
            ? await permissionManager.RoleService.updateRole(
                roleId,
                requestBody
              )
            : await permissionManager.RoleService.createRole(requestBody);
          return saveRoleRes;
        } catch (error) {
          setError({
            reason: JSON.stringify(error),
            instruction: "please reload this page",
          });
          return undefined;
        }
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
      if (
        isNonNullable(roleNameRef.current) &&
        isNonNullable(descriptionRef.current)
      ) {
        const name = roleNameRef.current.value;
        const description = descriptionRef.current.value;
        if (name !== "") {
          setValidationError(false);
          setIsSaving(true);

          if (isNonNullable(role)) {
            const newRole = {
              role_id: roleId,
              name,
              description,
              permissions: isNonNullable(permissions)
                ? permissions
                : role.permissions,
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
      <Paper className={styles.paper} ref={ref}>
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
        ) : isNonNullable(role) &&
          isNonNullable(databases) &&
          isNonNullable(actions) ? (
          <>
            <div className={styles.formContainer}>
              <Spacer direction="horizontal" size="2vw" />
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
              <Spacer direction="horizontal" size="2vw" />
              <div>
                <div className={styles.descriptionLabel}>Description</div>
                <Container>
                  <TextField
                    fullWidth
                    inputRef={descriptionRef}
                    multiline
                    defaultValue={role.description}
                    className={styles.descriptionInput}
                  />
                </Container>
              </div>
              <PermissionList
                permissions={
                  isNonNullable(permissions) ? permissions : role.permissions
                }
                actions={actions.actions}
                databases={
                  // TODO: fix API type
                  databases.databases as NonNullable<typeof databases.databases>
                }
                onChange={(newPermissions) =>
                  setPermissions([...newPermissions])
                }
              />
            </div>
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
      </Paper>
    );
  }
);

const RoleEditModal = ({
  focusTarget,
  onClose,
  onSave,
  open,
  roleId,
}: RoleEditModalProps): JSX.Element => {
  const styles = useStyles();
  return (
    // Modal child should be able to hold ref.
    <Modal
      component={Paper}
      open={open}
      onClose={onClose}
      className={styles.modal}
    >
      <RoleEditModalBody
        focusTarget={focusTarget}
        onClose={onClose}
        onSave={onSave}
        roleId={roleId}
      />
    </Modal>
  );
};

export { RoleEditModal };
export type { RoleEditModalProps };
