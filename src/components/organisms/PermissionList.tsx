import themeInstance from "../../theme";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  PermissionListItem,
  PermissionListItemProps,
} from "./PermissionListItem";
import { createRef, MouseEvent } from "react";
import { AddCircle } from "@material-ui/icons";
import { isNonNullable } from "../../utils";

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    lineHeight: 2,
  },
  header: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    lineHeight: 1.7,
  },
  tableContainer: {
    height: "60vh",
    overflowY: "auto",
  },
  addButtonContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },
}));

// TODO: receive permissions as type defined in API specification.
type PermissionListProps = {
  actions: PermissionListItemProps["actions"];
  databases: PermissionListItemProps["databases"];
  onChange: PermissionListItemProps["onChange"];
  onDelete: PermissionListItemProps["onDelete"];
  onAdd: (e: MouseEvent) => void;
  permissions: PermissionListItemProps["permission"][];
};

const PermissionList = ({
  permissions,
  onAdd,
  ...delegated
}: PermissionListProps): JSX.Element => {
  const styles = useStyles();

  const bottomRef = createRef<HTMLDivElement>();
  const scrollToBottomOfList = () => {
    if (isNonNullable(bottomRef) && isNonNullable(bottomRef.current)) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  return (
    <div>
      <label className={styles.title}>Permissions</label>
      <Container>
        <div className={styles.tableContainer}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <div className={styles.header}>Databases</div>
                </TableCell>
                <TableCell className={styles.header}>
                  <div className={styles.header}>Actions</div>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((permission, index) => {
                return (
                  <PermissionListItem
                    key={index}
                    permission={permission}
                    index={index}
                    {...delegated}
                  />
                );
              })}
              <div ref={bottomRef} />
            </TableBody>
          </Table>
        </div>
        <div className={styles.addButtonContainer}>
          <Button
            startIcon={<AddCircle />}
            onClick={(e) => {
              onAdd(e);
              scrollToBottomOfList();
            }}
          >
            Add permission
          </Button>
        </div>
      </Container>
    </div>
  );
};

export { PermissionList };
export type { PermissionListProps };
