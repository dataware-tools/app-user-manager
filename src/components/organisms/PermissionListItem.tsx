import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  createFilterOptionsForMultiSelect,
  MultiSelect,
} from "@dataware-tools/app-common";

type Database = string;

type Action = { action_id: string; name: string };

type Permission = { databases: Database[]; actions: Action[] };

type PermissionListItemProps = {
  actions: Action[];
  databases: Database[];
  index: number;
  onChange: (index: number, newValue: Permission) => void;
  onDelete: (index: number) => void;
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
  const filter = createFilterOptionsForMultiSelect<Database>();

  return (
    <TableRow>
      <TableCell style={{ lineHeight: 1.5, fontSize: "1rem" }}>
        <MultiSelect
          options={databases}
          value={permission.databases}
          onChange={(_, newValues) => {
            onChange(index, {
              databases: [...newValues],
              actions: permission.actions,
            });
          }}
          getOptionLabel={(option) => option}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            const isExisting = options.some((option) => inputValue === option);
            if (inputValue !== "" && !isExisting) {
              filtered.push(inputValue);
            }

            return filtered;
          }}
          freeSolo
          filterSelectedOptions
          fullWidth
        />
      </TableCell>
      <TableCell style={{ lineHeight: 1.5, fontSize: "1rem" }}>
        <MultiSelect
          options={actions}
          value={permission.actions}
          freeSolo={false}
          onChange={(_, newValues) => {
            onChange(index, {
              databases: permission.databases,
              actions: [...newValues],
            });
          }}
          getOptionLabel={(option) => option.name}
          getOptionSelected={(option, value) => {
            return option.action_id === value.action_id;
          }}
          filterSelectedOptions
          fullWidth
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
