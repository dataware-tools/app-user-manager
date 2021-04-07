import { permissionManager } from "@dataware-tools/app-common";
import { UserListItem } from "./UserListItem";
import { useMemo, RefObject } from "react";
import { isNonNullable } from "../../utils/index";

type Users = permissionManager.User[];
type Roles = permissionManager.Role[];
type UserListProps = {
  users: Users;
  roles: Roles;
  bottomRef?: RefObject<HTMLDivElement>;
};

const UserList = ({ users, roles, bottomRef }: UserListProps): JSX.Element => {
  const fixedRoles = useMemo(() => {
    return roles
      .map((role) => {
        if (
          isNonNullable(role) &&
          isNonNullable(role.name) &&
          isNonNullable(role.role_id)
        ) {
          return {
            name: role.name,
            role_id: role.role_id,
          };
        } else {
          return undefined;
        }
      })
      .filter((role): role is NonNullable<typeof role> => Boolean(role));
  }, [roles]);
  const fixedUsers = useMemo(() => {
    return users
      .map((user) => {
        if (
          isNonNullable(user) &&
          isNonNullable(user.name) &&
          isNonNullable(user.user_id) &&
          isNonNullable(user.roles)
        ) {
          return {
            name: user.name,
            user_id: user.user_id,
            roles: user.roles,
          };
        } else {
          return null;
        }
      })
      .filter((user): user is NonNullable<typeof user> => Boolean(user));
  }, [users]);

  return (
    <div style={{ paddingRight: "20px" }}>
      {fixedUsers.map((user) => (
        <UserListItem user={user} key={user.user_id} roles={fixedRoles} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export { UserList };
export type { UserListProps };
