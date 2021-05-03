import { permissionManager } from "@dataware-tools/app-common";
import { UserListItem, UserListItemProps } from "./UserListItem";
import { useMemo, RefObject } from "react";

type Users = permissionManager.UserModel[];
type Roles = permissionManager.RoleModel[];
type UserListProps = {
  users: Users;
  roles: Roles;
  bottomRef?: RefObject<HTMLDivElement>;
  onUpdateUser: UserListItemProps["onUpdateUser"];
};

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

  return (
    <div>
      {users.map((user) => (
        <UserListItem
          user={user}
          key={user.user_id}
          roles={fixedRoles}
          onUpdateUser={onUpdateUser}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export { UserList };
export type { UserListProps };
