import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import themeInstance from "../../theme";
import { MouseEvent, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

const useStyles = makeStyles((theme: typeof themeInstance) => ({}));

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
  onDelete: (e: MouseEvent, index: number) => void;
  permission: Permission;
};

const PermissionListItem = ({
  actions,
  databases,
  index,
  onChange,
  onDelete,
  permission,
}: PermissionListItemProps): JSX.Element => {
  const actionsToOptions = (actions: Action[]) => {
    const options = actions.map((action) => {
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

  const [currentDatabases, setCurrentDatabases] = useState<Options>(
    databasesToOptions(permission.databases)
  );
  const [currentActions, setCurrentActions] = useState<Options>(
    actionsToOptions(permission.actions)
  );

  return (
    <TableRow>
      <TableCell>
        <CreatableSelect
          isMulti
          closeMenuOnSelect={false}
          defaultValue={databasesToOptions(permission.databases)}
          options={databasesToOptions(databases)}
          onChange={(newValue) => {
            setCurrentDatabases([...newValue]);
            onChange(index, {
              databases: optionsToDatabases([...newValue]),
              actions: optionsToActions(currentActions),
            });
          }}
        />
      </TableCell>
      <TableCell>
        <Select
          isMulti
          closeMenuOnSelect={false}
          defaultValue={actionsToOptions(permission.actions)}
          options={actionsToOptions(actions)}
          onChange={(newValue) => {
            setCurrentActions([...newValue]);
            onChange(index, {
              databases: optionsToDatabases(currentDatabases),
              actions: optionsToActions([...newValue]),
            });
          }}
        />
      </TableCell>
      <TableCell align="center" padding="none" size="small">
        <IconButton onClick={(e) => onDelete(e, index)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export { PermissionListItem };
export type { PermissionListItemProps };
