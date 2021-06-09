import { MultiSelect } from "@dataware-tools/app-common";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TableCell, TableRow } from "@material-ui/core";

type Roles = {
  role_id: number;
  name: string;
}[];
type User = {
  user_id: string;
  name: string;
  roles: Roles;
};

type UserListItemProps = {
  user: User;
  roles: Roles;
  onUpdateUser: (user: User) => Promise<void> | void;
};

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  multiSelectContainer: {
    flex: 1,
    width: "100%",
  },
  roleCell: {
    width: "70%",
  },
});

const UserListItem = ({
  user,
  roles,
  onUpdateUser,
}: UserListItemProps): JSX.Element => {
  const [currentRoles, setCurrentRoles] = useState<Roles>(user.roles);
  const [prevRoles, setPrevRoles] = useState<Roles>(user.roles);
  const [isSavable, setIsSavable] = useState(false);

  const styles = useStyles();

  const onSave = async () => {
    setPrevRoles([...currentRoles]);
    await onUpdateUser({ ...user, roles: currentRoles });
  };

  const onFocusOut = () => {
    setCurrentRoles([...prevRoles]);
  };

  useEffect(() => {
    if (JSON.stringify(currentRoles) !== JSON.stringify(prevRoles)) {
      setIsSavable(true);
    } else {
      setIsSavable(false);
    }
  }, [currentRoles, prevRoles]);

  return (
    <TableRow>
      <TableCell>{user.name}</TableCell>
      <TableCell className={styles.roleCell}>
        <div className={styles.container}>
          <div className={styles.multiSelectContainer}>
            <MultiSelect
              freeSolo={false}
              options={roles}
              value={currentRoles}
              onChange={(_, newValues) => {
                setCurrentRoles([...newValues]);
              }}
              getOptionLabel={(option) => option.name}
              getOptionSelected={(option, value) => {
                return option.role_id === value.role_id;
              }}
              onSave={isSavable ? onSave : undefined}
              saveOnFocusOut={false}
              onFocusOut={onFocusOut}
              filterSelectedOptions
              fullWidth
            />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export { UserListItem };
export type { UserListItemProps };
