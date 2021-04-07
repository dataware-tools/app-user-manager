import {
  FetchStatus,
  fetchApi,
  databaseStore,
} from "@dataware-tools/app-common";
import Container from "@material-ui/core/Container";
import LoadingButton from "@material-ui/lab/LoadingButton";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import CloseIcon from "@material-ui/icons/Close";
import themeInstance from "../../theme";
import { makeStyles } from "@material-ui/core/styles";
import { API_ROUTE, Spacer, isNonNullable } from "../../utils";
import { useAuth0 } from "@auth0/auth0-react";
import { createRef, useState, useEffect } from "react";
import { PermissionList } from "./PermissionList";
import { ToolBar } from "./ToolBar";

const examplePermissionListProps = {
  actions: [
    { name: "test", action_id: "1" },
    { name: "foo", action_id: "2" },
    { name: "bar", action_id: "3" },
  ],
  databases: ["test", "foo", "bar"],
  onDelete: (e: any, index: any) => {
    alert("delete!");
    console.log("delete!");
    console.log(e);
    console.log(index);
  },
  onChange: (index: any, newValue: any) => {
    console.log("change!");
    console.log(index);
    console.log(newValue);
  },
  onAdd: (e: any) => {
    alert("add!");
    console.log("add!");
    console.log(e);
  },
};

const exampleExistingPermission = {
  ...examplePermissionListProps,
  permissions: [
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
  ],
};

const useStyles = makeStyles((theme: typeof themeInstance) => ({
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
    paddingLeft: "3vw",
    paddingRight: "3vw",
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
  discriptionInput: {
    display: "block",
    marginBottom: "10px",
  },
}));

type RoleEditModalProps = {
  open: boolean;
  onClose: () => void;
  focusTarget?: "roleName";
  fetchMethod?: "create" | "update";
  roleId?: number;
};

const RoleEditModal = ({
  open,
  onClose,
  focusTarget,
  fetchMethod,
  roleId,
}: RoleEditModalProps): JSX.Element => {
  const styles = useStyles();
  const roleNameRef = createRef<HTMLInputElement>();
  const descriptionRef = createRef<HTMLInputElement>();
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsError(false);
    setIsSaving(false);
  }, [open]);

  return (
    <Modal
      component={Paper}
      open={open}
      onClose={onClose}
      className={styles.modal}
    >
      <Paper className={styles.paper}>
        <ToolBar>
          <Spacer axis="horizontal" size="2vw" />
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
            placeholder="Name"
            error={isError}
            inputRef={roleNameRef}
          />
          <Spacer axis="horizontal" size="2vw" />
          <CloseIcon
            className={styles.closeButton}
            onClick={() => {
              onClose();
            }}
            fontSize="large"
          />
        </ToolBar>
        <div className={styles.formContainer}>
          <div>
            <label className={styles.descriptionLabel}>Description</label>
            <Container>
              <TextField
                fullWidth
                inputRef={descriptionRef}
                multiline
                className={styles.discriptionInput}
              />
            </Container>
          </div>
          <PermissionList {...exampleExistingPermission} />
        </div>
        <ToolBar>
          <LoadingButton
            size="large"
            onClick={() => {
              if (isNonNullable(roleNameRef.current)) {
                console.log(roleNameRef.current.value);
                if (roleNameRef.current.value !== "") {
                  alert("this is eternal saving! please push close button.");
                  setIsError(false);
                  setIsSaving(true);
                } else {
                  alert("role name is invalid!");
                  setIsError(true);
                }
              }
            }}
            pending={isSaving}
          >
            Save
          </LoadingButton>
          <Spacer axis="horizontal" size="2vw" />
        </ToolBar>
        <Spacer axis="vertical" size="2vh" />
      </Paper>
    </Modal>
  );
};

export { RoleEditModal };
export type { RoleEditModalProps };
