import {
  createFilterOptionsForMultiSelect,
  MultiSelect,
  MultiSelectProps,
} from "@dataware-tools/app-common";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

type Database = string;

type Action = { action_id: string; name: string };

type Permission = { databases: Database[]; actions: Action[] };

export type PermissionListItemPresentationProps = {
  databaseMultiSelectProps: Pick<
    MultiSelectProps<Database, false, true>,
    "onChange" | "getOptionLabel" | "filterOptions"
  >;
  actionMultiSelectProps: Pick<
    MultiSelectProps<Action, false, false>,
    "onChange" | "getOptionLabel" | "isOptionEqualToValue"
  >;
  onDeleteButtonClick: () => void;
} & Omit<PermissionListItemProps, "onChange" | "onDelete" | "index">;

export type PermissionListItemProps = {
  actions: Action[];
  databases: Database[];
  index: number;
  onChange: (index: number, newValue: Permission) => void;
  onDelete: (index: number) => void;
  permission: Permission;
};

export const PermissionListItemPresentation = ({
  actions,
  databases,
  permission,
  databaseMultiSelectProps,
  actionMultiSelectProps,
  onDeleteButtonClick,
}: PermissionListItemPresentationProps): JSX.Element => {
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

export const PermissionListItem = ({
  index,
  permission,
  onChange,
  onDelete,
  ...delegated
}: PermissionListItemProps): JSX.Element => {
  const filter = createFilterOptionsForMultiSelect<Database>();
  const databaseMultiSelectProps: PermissionListItemPresentationProps["databaseMultiSelectProps"] = {
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

  const actionMultiSelectProps: PermissionListItemPresentationProps["actionMultiSelectProps"] = {
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

  const onDeleteButtonClick: PermissionListItemPresentationProps["onDeleteButtonClick"] = () =>
    onDelete(index);

  return (
    <PermissionListItemPresentation
      permission={permission}
      databaseMultiSelectProps={databaseMultiSelectProps}
      actionMultiSelectProps={actionMultiSelectProps}
      onDeleteButtonClick={onDeleteButtonClick}
      {...delegated}
    />
  );
};
