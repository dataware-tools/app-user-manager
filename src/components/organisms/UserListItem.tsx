import { MultiSelect } from "@dataware-tools/app-common";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/styles";
import { useState, useEffect, memo } from "react";

type Roles = {
  role_id: number;
  name: string;
}[];
type User = {
  user_id: string;
  name: string;
  roles: Roles;
};

type Props = {
  classes: ReturnType<typeof useStyles>;
  roleOptions: Roles;
  onChange: (newRoles: Roles) => void;
  onCancelEdit: () => void;
  onSave?: () => Promise<void>;
} & Omit<ContainerProps, "onUpdateUser">;

type ContainerProps = {
  user: User;
  roles: Roles;
  onUpdateUser: (user: User) => Promise<void> | void;
};

const Component = ({
  user,
  classes,
  roles,
  roleOptions,
  onCancelEdit,
  onChange,
  onSave,
}: Props) => {
  return (
    <TableRow>
      <TableCell>{user.name}</TableCell>
      <TableCell className={classes.roleCell}>
        <div className={classes.container}>
          <div className={classes.multiSelectContainer}>
            <MultiSelect
              freeSolo={false}
              options={roleOptions}
              value={roles}
              onChange={(_, newValues) => {
                onChange(newValues);
              }}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => {
                return option.role_id === value.role_id;
              }}
              onSave={onSave}
              saveOnFocusOut={false}
              onFocusOut={onCancelEdit}
              filterSelectedOptions
              fullWidth
            />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
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

const Container = memo(
  ({ user, onUpdateUser, roles }: ContainerProps): JSX.Element => {
    const [currentRoles, setCurrentRoles] = useState<Roles>(user.roles);
    const [prevRoles, setPrevRoles] = useState<Roles>(user.roles);
    const [isSavable, setIsSavable] = useState(false);

    const classes = useStyles();

    const onSave = async () => {
      await onUpdateUser({ ...user, roles: currentRoles });
      setPrevRoles(currentRoles);
    };

    const onCancelEdit = () => {
      setCurrentRoles(prevRoles);
    };

    useEffect(() => {
      if (JSON.stringify(currentRoles) !== JSON.stringify(prevRoles)) {
        setIsSavable(true);
      } else {
        setIsSavable(false);
      }
    }, [currentRoles, prevRoles]);

    return (
      <Component
        classes={classes}
        onSave={isSavable ? onSave : undefined}
        onCancelEdit={onCancelEdit}
        onChange={setCurrentRoles}
        roleOptions={roles}
        roles={currentRoles}
        user={user}
      />
    );
  }
);

export { Container as UserListItem };
export type { ContainerProps as UserListItemProps };
