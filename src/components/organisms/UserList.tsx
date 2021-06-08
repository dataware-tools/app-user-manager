import {permissionManager} from "@dataware-tools/app-common";
import {UserListItem, UserListItemProps} from "./UserListItem";
import {useMemo, RefObject} from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {makeStyles} from "@material-ui/core/styles";

type Users = permissionManager.UserModel[];
type Roles = permissionManager.RoleModel[];
type UserListProps = {
  users: Users;
  roles: Roles;
  bottomRef?: RefObject<HTMLDivElement>;
  onUpdateUser: UserListItemProps["onUpdateUser"];
};

const useStyles = makeStyles({
  headerCell: {
    height: "47px"
  }
});

const UserList = ({
                    users,
                    roles,
                    bottomRef,
                    onUpdateUser,
                  }: UserListProps): JSX.Element => {
  const fixedRoles = useMemo(() => {
    return roles.map((role) => ({
      name: role.name,
      role_id: role.role_id,
    }));
  }, [roles]);

  const styles = useStyles();

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell key="user" className={styles.headerCell}>User</TableCell>
            <TableCell key="roles" className={styles.headerCell}>Roles</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <UserListItem
              user={user}
              key={user.user_id}
              roles={fixedRoles}
              onUpdateUser={onUpdateUser}
            />
          ))}
        </TableBody>
      </Table>
      <div ref={bottomRef}/>
    </>
  );
};

export {UserList};
export type {UserListProps};
