import { metaStore } from "@dataware-tools/api-meta-store-client";
import {
  createFilterOptionsForMultiSelect,
  MultiSelect,
  MultiSelectProps,
} from "@dataware-tools/app-common";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

type Database = metaStore.DatabaseModel;

type Action = { action_id: string; name: string };

type Permission = { databases: string[]; actions: Action[] };

export type PermissionListItemPresentationProps = {
  databaseMultiSelectProps: Pick<
    MultiSelectProps<Database | string, false, true>,
    "onChange" | "getOptionLabel" | "filterOptions" | "isOptionEqualToValue"
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
  const databaseMultiSelectProps: PermissionListItemPresentationProps["databaseMultiSelectProps"] =
    {
      getOptionLabel: (option) => {
        return typeof option === "string"
          ? option
          : option.name
          ? `${option.database_id} (name: ${option.name})`
          : option.database_id;
      },
      isOptionEqualToValue: (option, value) => {
        console.log(option);
        console.log(value);
        return typeof option === "string"
          ? typeof value === "string"
            ? option === value
            : option === value.name
          : typeof value === "string"
          ? option.database_id === value
          : option.database_id === value.database_id;
      },
      filterOptions: (options, params) => {
        const filtered = filter(options as Database[], params);

        const { inputValue } = params;
        const isExisting = options.some((option) =>
          typeof option === "string"
            ? inputValue === option
            : inputValue === option.database_id
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({ database_id: inputValue });
        }

        return filtered;
      },
      onChange: (_, newValues) => {
        const newDatabases = newValues.map((value) =>
          typeof value === "string" ? value : value.database_id
        );
        onChange(index, {
          databases: newDatabases,
          actions: permission.actions,
        });
      },
    };

  const actionMultiSelectProps: PermissionListItemPresentationProps["actionMultiSelectProps"] =
    {
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

  const onDeleteButtonClick: PermissionListItemPresentationProps["onDeleteButtonClick"] =
    () => onDelete(index);

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
