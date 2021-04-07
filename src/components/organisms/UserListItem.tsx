import { MultiSelect } from "../molecules/MultiSelect";
import { useAuth0 } from "@auth0/auth0-react";
import { permissionManager, fetchApi } from "@dataware-tools/app-common";
import { useState, useEffect } from "react";
import { API_ROUTE, FetchStatusType, isNonNullable, Spacer } from "../../utils";
import { makeStyles } from "@material-ui/core/styles";

type Roles = {
  role_id?: number;
  name?: string;
}[];
type User = {
  user_id: string;
  name: string;
  roles: Roles;
};
type UserListItemProps = {
  user: User;
  roles: Roles;
};
type Options = {
  value: string;
  label: string;
}[];
type ResUpdateUser = permissionManager.User | undefined;
type StatusUpdateUser =
  | ({
      res: permissionManager.User | undefined;
    } & FetchStatusType)
  | null;

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  userNameContainer: {
    alignItems: "center",
    display: "flex",
    flex: 1,
  },
  multiSelectContainer: {
    flex: 5,
  },
});

const UserListItem = ({ user, roles }: UserListItemProps): JSX.Element => {
  const [isFetchFailed, setIsFetchFailed] = useState<boolean>(false);
  const [statusUpdateUser, setStatusUpdateUser] = useState<StatusUpdateUser>(
    null
  );
  const [currentRoles, setCurrentRoles] = useState<Options>([]);
  const [prevRoles, setPrevRoles] = useState<Options>([]);
  const [currentOptions, setCurrentOptions] = useState<Options>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavable, setIsSavable] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const styles = useStyles();

  const rolesToOptions = (roles: Roles) => {
    const options = roles
      .map((role) => {
        if (isNonNullable(role.role_id) && isNonNullable(role.name)) {
          return {
            value: `${role.role_id}`,
            label: role.name,
          };
        } else {
          return null;
        }
      })
      .filter((role): role is NonNullable<typeof role> => Boolean(role));
    return options;
  };

  const selectedRolesToRoleIds = (currentRoles: Options) => {
    const roleIds = currentRoles.map(
      (role) => (role.value as unknown) as number
    );
    return roleIds;
  };

  const updateCurrentRoles = (res: ResUpdateUser) => {
    if (isNonNullable(res) && isNonNullable(res?.roles)) {
      setCurrentRoles(rolesToOptions(res.roles));
    } else {
      setIsFetchFailed(true);
    }
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
    setIsSaving(true);
    setPrevRoles([...currentRoles]);
    const roleIds = selectedRolesToRoleIds(currentRoles);
    // TODO: fetching process in onSave() should be inherit from parent of UserList. it may be simplified thanks to SWR.
    const res = await getAccessTokenSilently()
      .then((accessToken: string) => {
        permissionManager.OpenAPI.TOKEN = accessToken;
        permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
      })
      .then(() =>
        permissionManager.UserService.updateUser(user.user_id, {
          role_ids: roleIds,
        })
      )
      .catch(() => undefined);
    updateCurrentRoles(res);
    setIsSaving(false);
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

  return isFetchFailed ? (
    <div>Fetch failed! please relaod this page!</div>
  ) : (
    <div className={styles.container}>
      <div className={styles.userNameContainer}>
        <Spacer axis="horizontal" size={5} />
        <div>{user.name}</div>
      </div>
      <div className={styles.multiSelectContainer}>
        <MultiSelect
          options={currentOptions}
          isCreatable={false}
          onChange={onChange}
          isSaving={isSaving}
          currentSelected={[...currentRoles]}
          onSave={onSave}
          onFocusOut={onFocusOut}
          haveSaveButton={isSavable}
        />
      </div>
    </div>
  );
};

export { UserListItem };
export type { UserListItemProps };
