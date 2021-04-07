import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import themeInstance from "../../theme";
import { makeStyles } from "@material-ui/core/styles";
import { isNonNullable } from "../../utils";
import { MouseEvent } from "react";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  row: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  cell: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  deleteButton: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

type CellContent = string | number;
type TargetDetail = {
  index: number;
  row: Record<string, CellContent>;
  content: { field: string; data: CellContent };
};

type RoleListItemProps = {
  data: Record<string, string | number>;
  index: number;
  onDeleteRow?: (e: MouseEvent, targetDetail: TargetDetail) => void;
  onClickRow?: (e: MouseEvent, targetDetail: TargetDetail) => void;
  columns: { field: string; type?: "string" | "number" }[];
};

const RoleListItem = ({
  data,
  index,
  onDeleteRow,
  onClickRow,
  columns,
}: RoleListItemProps): JSX.Element => {
  const styles = useStyles();
  return (
    <TableRow className={styles.row}>
      {columns.map((column) => (
        <TableCell
          className={styles.cell}
          key={column.field}
          align={column.type === "number" ? "right" : "left"}
          onClick={(e) => {
            if (isNonNullable(onClickRow)) {
              onClickRow(e, {
                index,
                row: data,
                content: { field: column.field, data: data[column.field] },
              });
            }
          }}
        >
          {data[column.field]}
        </TableCell>
      ))}
      {isNonNullable(onDeleteRow) ? (
        <TableCell
          className={styles.deleteButton}
          key="deleteButton"
          align="center"
          onClick={(e) => {
            if (isNonNullable(onDeleteRow)) {
              onDeleteRow(e, {
                index,
                row: data,
                content: { field: "__deleteButton", data: "__deleteButton" },
              });
            }
          }}
        >
          <DeleteIcon />
        </TableCell>
      ) : null}
    </TableRow>
  );
};

export { RoleListItem };
export type { RoleListItemProps, TargetDetail };
