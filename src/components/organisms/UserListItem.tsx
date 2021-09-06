import { MultiSelect } from "@dataware-tools/app-common";
import Box from "@material-ui/core/Box";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
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

export type UserListItemPresentationProps = {
  roleOptions: Roles;
  onChange: (newRoles: Roles) => void;
  onCancelEdit: () => void;
  onSave?: () => Promise<void>;
} & Omit<UserListItemProps, "onUpdateUser">;

export type UserListItemProps = {
  user: User;
  roles: Roles;
  onUpdateUser: (user: User) => Promise<void> | void;
};

export const UserListItemPresentation = ({
  user,
  roles,
  roleOptions,
  onCancelEdit,
  onChange,
  onSave,
}: UserListItemPresentationProps): JSX.Element => {
  return (
    <TableRow>
      <TableCell>{user.name}</TableCell>
      <TableCell
        sx={{
          width: "70%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Box
            sx={{
              flex: 1,
              width: "100%",
            }}
          >
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
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export const UserListItem = memo(
  ({ user, onUpdateUser, roles }: UserListItemProps): JSX.Element => {
    const [currentRoles, setCurrentRoles] = useState<Roles>(user.roles);
    const [prevRoles, setPrevRoles] = useState<Roles>(user.roles);
    const [isSavable, setIsSavable] = useState(false);

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
      <UserListItemPresentation
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
