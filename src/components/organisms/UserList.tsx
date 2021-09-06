import { permissionManager } from "@dataware-tools/app-common";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useMemo, RefObject } from "react";
import { UserListItem, UserListItemProps } from "./UserListItem";

type Users = permissionManager.UserModel[];
type Roles = permissionManager.RoleModel[];

export type UserListPresentationProps = {
  roles: {
    name: string;
    role_id: number;
  }[];
} & Omit<UserListProps, "roles">;

export type UserListProps = {
  users: Users;
  roles: Roles;
  bottomRef?: RefObject<HTMLDivElement>;
  onUpdateUser: UserListItemProps["onUpdateUser"];
};

export const UserListPresentation = ({
  users,
  roles,
  bottomRef,
  onUpdateUser,
}: UserListPresentationProps): JSX.Element => {
  return (
    <>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell key="user" sx={{ height: "47px" }}>
              User
            </TableCell>
            <TableCell key="roles" sx={{ height: "47px" }}>
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

export const UserList = ({
  roles,
  ...delegated
}: UserListProps): JSX.Element => {
  const fixedRoles = useMemo(() => {
    return roles.map((role) => ({
      name: role.name,
      role_id: role.role_id,
    }));
  }, [roles]);

  return <UserListPresentation roles={fixedRoles} {...delegated} />;
};
