import { permissionManager } from "@dataware-tools/app-common";
import { UserListItem, UserListItemProps } from "./UserListItem";
import { useMemo, RefObject } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { makeStyles } from "@material-ui/core/styles";

type Users = permissionManager.UserModel[];
type Roles = permissionManager.RoleModel[];

type Props = {
  classes: ReturnType<typeof useStyles>;
  roles: {
    name: string;
    role_id: number;
  }[];
} & Omit<ContainerProps, "roles">;
type ContainerProps = {
  users: Users;
  roles: Roles;
  bottomRef?: RefObject<HTMLDivElement>;
  onUpdateUser: UserListItemProps["onUpdateUser"];
};

const Component = ({
  classes,
  users,
  roles,
  bottomRef,
  onUpdateUser,
}: Props) => {
  return (
    <>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell key="user" className={classes.headerCell}>
              User
            </TableCell>
            <TableCell key="roles" className={classes.headerCell}>
              Roles
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <UserListItem
              user={user}
              key={user.user_id}
              roles={roles}
              onUpdateUser={onUpdateUser}
            />
          ))}
        </TableBody>
      </Table>
      <div ref={bottomRef} />
    </>
  );
};
const useStyles = makeStyles({
  headerCell: {
    height: "47px",
  },
});

const Container = ({ roles, ...delegated }: ContainerProps): JSX.Element => {
  const fixedRoles = useMemo(() => {
    return roles.map((role) => ({
      name: role.name,
      role_id: role.role_id,
    }));
  }, [roles]);

  const classes = useStyles();

  return <Component classes={classes} roles={fixedRoles} {...delegated} />;
};

export { Container as UserList };
export type { ContainerProps as UserListProps };
