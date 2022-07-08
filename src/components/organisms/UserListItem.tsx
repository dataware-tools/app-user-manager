import { MultiSelect } from "@dataware-tools/app-common";
import { Option } from "@dataware-tools/app-common/dist/components/MultiSelect";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useState, memo } from "react";

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
  onSave: () => Promise<void>;
} & Omit<UserListItemProps, "onUpdateUser">;

export type UserListItemProps = {
  user: User;
  roles: Roles;
  onUpdateUser: (user: User) => Promise<void> | void;
};

const stringToHash = (string: string | undefined) => {
  if (!string) return 0;
  let hash = 0;

  if (string.length === 0) return hash;

  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return hash;
};

export const UserListItemPresentation = ({
  user,
  roles,
  roleOptions,
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
              // @ts-expect-error to be fixed
              onChange={(_, newValues) => {
                onChange(newValues);
              }}
              getOptionLabel={(option: Option) => {
                if (typeof option !== "string" && typeof option !== "number") {
                  return option.name ? option.name : "";
                } else if (typeof option === "string") {
                  return option;
                }
                return "";
              }}
              getOptionColor={(option: Option) => {
                console.log(option);
                if (typeof option !== "string" && typeof option !== "number") {
                  const hue = stringToHash(option.name) % 360;
                  return `hsl(${hue}, 50%, 80%)`;
                }
                return "";
              }}
              isOptionEqualToValue={(option, value) => {
                // @ts-expect-error to be fixed
                return option.role_id === value.role_id;
              }}
              onFocusOut={onSave}
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

    const onSave = async () => {
      if (JSON.stringify(currentRoles) !== JSON.stringify(prevRoles)) {
        await onUpdateUser({ ...user, roles: currentRoles });
        setPrevRoles(currentRoles);
      }
    };

    return (
      <UserListItemPresentation
        onSave={onSave}
        onChange={setCurrentRoles}
        roleOptions={roles}
        roles={currentRoles}
        user={user}
      />
    );
  }
);
