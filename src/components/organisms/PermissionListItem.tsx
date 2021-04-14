import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { RefObject } from "react";

type Database = string;

type Action = { action_id: string; name: string };

type Permission = { databases: Database[]; actions: Action[] };

type Options = {
  value: string;
  label: string;
}[];

type PermissionListItemProps = {
  actions: Action[];
  databases: Database[];
  index: number;
  onChange: (index: number, newValue: Permission) => void;
  onDelete: (index: number) => void;
  permission: Permission;
  listContainerRef: RefObject<HTMLDivElement>;
};

const PermissionListItem = ({
  actions,
  databases,
  index,
  onChange,
  onDelete,
  permission,
  listContainerRef,
}: PermissionListItemProps): JSX.Element => {
  const actionsToOptions = (actions: Action[]) => {
    const options = actions
      .filter((action): action is NonNullable<typeof action> => Boolean(action))
      .map((action) => {
        return {
          value: action.action_id,
          label: action.name,
        };
      });
    return options;
  };

  const optionsToActions = (options: Options) => {
    const actions = options.map((option) => ({
      action_id: option.value,
      name: option.label,
    }));
    return actions;
  };

  const databasesToOptions = (databases: Database[]) => {
    const options = databases.map((database) => ({
      value: database,
      label: database,
    }));
    return options;
  };

  const optionsToDatabases = (options: Options) => {
    const databases = options.map((option) => option.value);
    return databases;
  };

  return (
    <TableRow>
      <TableCell>
        <CreatableSelect
          isMulti
          closeMenuOnSelect={false}
          menuPlacement="auto"
          // Below 3 props prevent visual bugs such that menu hide under modal.
          // However, when role have many permission, scrolling is not smooth since many scrolling event listener exist.
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          menuPortalTarget={document.body}
          closeMenuOnScroll={(e) => e.target === listContainerRef.current}
          value={databasesToOptions(permission.databases)}
          options={databasesToOptions(databases)}
          onChange={(newValue) => {
            onChange(index, {
              databases: optionsToDatabases([...newValue]),
              actions: [...permission.actions],
            });
          }}
        />
      </TableCell>
      <TableCell>
        <Select
          isMulti
          closeMenuOnSelect={false}
          menuPlacement="auto"
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          menuPortalTarget={document.body}
          closeMenuOnScroll={(e) => e.target === listContainerRef.current}
          value={actionsToOptions(permission.actions)}
          options={actionsToOptions(actions)}
          onChange={(newValue) => {
            onChange(index, {
              databases: [...permission.databases],
              actions: optionsToActions([...newValue]),
            });
          }}
        />
      </TableCell>
      <TableCell align="center" padding="none" size="small">
        <IconButton onClick={() => onDelete(index)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export { PermissionListItem };
export type { PermissionListItemProps };
