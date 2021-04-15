import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { PermissionListItem } from "./PermissionListItem";
import { createRef } from "react";
import { AddCircle } from "@material-ui/icons";
import { isNonNullable, Spacer } from "../../utils";
import { permissionManager, databaseStore } from "@dataware-tools/app-common";
import themeInstance from "../../theme";

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  header: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    lineHeight: 1.7,
  },
  tableContainer: {
    // TODO: media query
    height: "35vh",
    overflowY: "auto",
  },
  tableTop: {
    alignItems: "center",
    display: "flex",
    padding: "10px 0",
  },
  addButton: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    padding: "5px",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  bottomSpace: {
    minHeight: "50px",
  },
}));

type Action = permissionManager.ActionModel;
type Database = databaseStore.DatabaseModel;

type Permission = permissionManager.RoleModel["permissions"][number];
type PermissionListProps = {
  actions: Action[];
  databases: Database[];
  onChange: (newValue: Permission[]) => void;
  permissions: Permission[];
};

const PermissionList = ({
  actions,
  databases,
  onChange,
  permissions,
}: PermissionListProps): JSX.Element => {
  const styles = useStyles();

  const listContainerRef = createRef<HTMLDivElement>();
  const listBottomRef = createRef<HTMLDivElement>();

  const scrollToBottomOfList = () => {
    if (isNonNullable(listBottomRef) && isNonNullable(listBottomRef.current)) {
      listBottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const fixedDatabases = databases
    // TODO: fix API type? 名前を必ず返すなら name は required にする.
    .filter((database) => Boolean(database.name))
    .map((database) => database.name as NonNullable<typeof database.name>);

  return (
    <div>
      <div className={styles.tableTop}>
        <div className={styles.title}>Permissions</div>
        <Spacer direction="horizontal" size="5px" />
        <div
          onClick={() => {
            const newPermissions = [...permissions];
            newPermissions.push({ databases: [], actions: [] });
            onChange(newPermissions);
            scrollToBottomOfList();
          }}
          className={styles.addButton}
        >
          <AddCircle />
        </div>
      </div>
      <Container>
        <div className={styles.tableContainer} ref={listContainerRef}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <div className={styles.header}>Databases</div>
                </TableCell>
                <TableCell>
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
                    actions={actions}
                    databases={fixedDatabases}
                    onChange={(targetIndex, newValue) => {
                      const newPermissions = permissions.map((permission, i) =>
                        i === targetIndex ? newValue : permission
                      );
                      onChange(newPermissions);
                    }}
                    onDelete={(targetIndex) => {
                      const newPermissions = permissions.filter(
                        (permission, i) => i !== targetIndex
                      );
                      onChange(newPermissions);
                    }}
                  />
                );
              })}
            </TableBody>
          </Table>
          {/* FIXME: state が非同期で更新されるので追加された permission までスクロールしないというを解決しようとしてこうなっています
              より良い案を募集してます
              そもそも末尾に追加するのではなく，先頭に追加するべき？ */}
          <div className={styles.bottomSpace} />
          <div ref={listBottomRef} />
        </div>
      </Container>
    </div>
  );
};

export { PermissionList };
export type { PermissionListProps };
