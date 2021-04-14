import { MultiSelect } from "../molecules/MultiSelect";
import { useState, useEffect, RefObject } from "react";
import { Spacer } from "../../utils";
import { makeStyles } from "@material-ui/core/styles";
import { permissionManager } from "@dataware-tools/app-common";

type Roles = {
  role_id: number;
  name: string;
}[];
type User = {
  user_id: string;
  name: string;
  roles: Roles;
};
type Options = {
  value: string;
  label: string;
}[];

type UserListItemProps = {
  user: User;
  roles: Roles;
  onUpdateUser: (user: User) => Promise<void> | void;
  listContainerRef?: RefObject<HTMLElement>;
};

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  multiSelectContainer: {
    width: "100%",
  },
  userName: {
    alignItems: "center",
    display: "flex",
    overflowWrap: "break-word",
    width: "15vw",
    wordBreak: "break-all",
  },
});

const UserListItem = ({
  user,
  roles,
  onUpdateUser,
  listContainerRef,
}: UserListItemProps): JSX.Element => {
  const [currentRoles, setCurrentRoles] = useState<Options>([]);
  const [prevRoles, setPrevRoles] = useState<Options>([]);
  const [currentOptions, setCurrentOptions] = useState<Options>([]);
  const [isSavable, setIsSavable] = useState(false);

  const styles = useStyles();

  const rolesToOptions = (roles: Roles) => {
    const options = roles.map((role) => ({
      value: `${role.role_id}`,
      label: role.name,
    }));
    return options;
  };

  const optionsToRoles = (options: Options) => {
    const roles = options.map((option) => ({
      role_id: (option.value as unknown) as permissionManager.RoleModel["role_id"],
      name: option.label,
    }));
    return roles;
  };

  useEffect(() => {
    const options = rolesToOptions(roles);
    setCurrentOptions(options);
  }, [roles]);

  useEffect(() => {
    setCurrentRoles(rolesToOptions(user.roles));
    setPrevRoles(rolesToOptions(user.roles));
  }, [user.roles]);

  const onSave = async () => {
    setPrevRoles([...currentRoles]);
    const roles = optionsToRoles(currentRoles);
    await onUpdateUser({ ...user, roles: roles });
  };

  const onChange = (newInput: Options) => {
    setCurrentRoles([...newInput]);
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
    <div className={styles.container}>
      <div className={styles.userName}>{user.name}</div>
      <Spacer direction="horizontal" size="1vw" />
      <div className={styles.multiSelectContainer}>
        <MultiSelect
          options={currentOptions}
          isCreatable={false}
          onChange={onChange}
          currentSelected={[...currentRoles]}
          onSave={onSave}
          onFocusOut={onFocusOut}
          haveSaveButton={isSavable}
          closeMenuOnScroll={(e) => {
            return e.target === listContainerRef?.current;
          }}
          styles={{
            menuPortal: (base: Record<string, unknown>) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          menuPortalTarget={document.body}
        />
      </div>
    </div>
  );
};

export { UserListItem };
export type { UserListItemProps };
