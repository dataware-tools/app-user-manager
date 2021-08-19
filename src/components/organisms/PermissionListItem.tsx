import {
  createFilterOptionsForMultiSelect,
  MultiSelect,
  MultiSelectProps,
} from "@dataware-tools/app-common";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";

type Database = string;

type Action = { action_id: string; name: string };

type Permission = { databases: Database[]; actions: Action[] };

type Props = {
  databaseMultiSelectProps: Pick<
    MultiSelectProps<Database, false, true>,
    "onChange" | "getOptionLabel" | "filterOptions"
  >;
  actionMultiSelectProps: Pick<
    MultiSelectProps<Action, false, false>,
    "onChange" | "getOptionLabel" | "isOptionEqualToValue"
  >;
  onDeleteButtonClick: () => void;
} & Omit<ContainerProps, "onChange" | "onDelete" | "index">;

type ContainerProps = {
  actions: Action[];
  databases: Database[];
  index: number;
  onChange: (index: number, newValue: Permission) => void;
  onDelete: (index: number) => void;
  permission: Permission;
};

const Component = ({
  actions,
  databases,
  permission,
  databaseMultiSelectProps,
  actionMultiSelectProps,
  onDeleteButtonClick,
}: Props): JSX.Element => {
  return (
    <TableRow>
      <TableCell style={{ lineHeight: 1.5, fontSize: "1rem" }}>
        <MultiSelect
          options={databases}
          value={permission.databases}
          freeSolo
          filterSelectedOptions
          fullWidth
          {...databaseMultiSelectProps}
        />
      </TableCell>
      <TableCell style={{ lineHeight: 1.5, fontSize: "1rem" }}>
        <MultiSelect
          options={actions}
          value={permission.actions}
          freeSolo={false}
          filterSelectedOptions
          fullWidth
          {...actionMultiSelectProps}
        />
      </TableCell>
      <TableCell align="center" padding="none" size="small">
        <IconButton onClick={onDeleteButtonClick}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const Container = ({
  index,
  permission,
  onChange,
  onDelete,
  ...delegated
}: ContainerProps): JSX.Element => {
  const filter = createFilterOptionsForMultiSelect<Database>();
  const databaseMultiSelectProps: Props["databaseMultiSelectProps"] = {
    filterOptions: (options, params) => {
      const filtered = filter(options, params);

      const { inputValue } = params;
      const isExisting = options.some((option) => inputValue === option);
      if (inputValue !== "" && !isExisting) {
        filtered.push(inputValue);
      }

      return filtered;
    },
    getOptionLabel: (option) => option,
    onChange: (_, newValues) => {
      onChange(index, {
        databases: [...newValues],
        actions: permission.actions,
      });
    },
  };

  const actionMultiSelectProps: Props["actionMultiSelectProps"] = {
    getOptionLabel: (option) => option.name,
    isOptionEqualToValue: (option, value) => {
      return option.action_id === value.action_id;
    },
    onChange: (_, newValues) => {
      onChange(index, {
        databases: permission.databases,
        actions: [...newValues],
      });
    },
  };

  const onDeleteButtonClick: Props["onDeleteButtonClick"] = () =>
    onDelete(index);

  return (
    <Component
      permission={permission}
      databaseMultiSelectProps={databaseMultiSelectProps}
      actionMultiSelectProps={actionMultiSelectProps}
      onDeleteButtonClick={onDeleteButtonClick}
      {...delegated}
    />
  );
};

export { Container as PermissionListItem };
export type { ContainerProps as PermissionListItemProps };
