import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { RefObject } from "react";
import { isNonNullable } from "../../utils";
import { RoleListItem, RoleListItemProps } from "./RoleListItem";

type RoleListProps = {
  rows: RoleListItemProps["data"][];
  columns: RoleListItemProps["columns"];
  onDeleteRow?: RoleListItemProps["onDeleteRow"];
  onClickRow?: RoleListItemProps["onClickRow"];
  stickyHeader?: boolean;
  bottomRef?: RefObject<HTMLDivElement>;
};

const RoleList = ({
  rows,
  columns,
  onDeleteRow,
  onClickRow,
  stickyHeader,
  bottomRef,
}: RoleListProps): JSX.Element => {
  const rowProps = { columns, onDeleteRow, onClickRow };
  return (
    <>
      <Table stickyHeader={stickyHeader}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.field}
                align={column.type === "number" ? "right" : "left"}
              >
                {column.field}
              </TableCell>
            ))}
            {isNonNullable(onDeleteRow) ? <TableCell /> : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <RoleListItem key={index} data={row} index={index} {...rowProps} />
          ))}
        </TableBody>
      </Table>
      <div ref={bottomRef} />
    </>
  );
};

export { RoleList };
export type { RoleListProps };
