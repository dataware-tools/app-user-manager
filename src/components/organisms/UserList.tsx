import { permissionManager } from "@dataware-tools/app-common";
import { UserListItem, UserListItemProps } from "./UserListItem";
import { useMemo, RefObject } from "react";

type Users = permissionManager.UserModel[];
type Roles = permissionManager.RoleModel[];
type UserListProps = {
  users: Users;
  roles: Roles;
  bottomRef?: RefObject<HTMLDivElement>;
  // TODO: onChange として，user リストをそのまま渡す
  onUpdateUser: UserListItemProps["onUpdateUser"];
  userListContainerRef: RefObject<HTMLElement>;
};

const UserList = ({
  users,
  roles,
  bottomRef,
  onUpdateUser,
  userListContainerRef,
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
          listContainerRef={userListContainerRef}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export { UserList };
export type { UserListProps };
