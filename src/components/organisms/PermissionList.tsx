import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  PermissionListItem,
  PermissionListItemProps,
} from "./PermissionListItem";
import { createRef, ReactNode, RefObject } from "react";
import AddCircle from "@material-ui/icons/AddCircle";
import {
  permissionManager,
  metaStore,
  theme as themeInstance,
  Spacer,
  SquareIconButton,
} from "@dataware-tools/app-common";

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  header: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    lineHeight: 1.7,
  },
  tableContainer: {
    height: "30vh",
    margin: "0 3vw",
    overflowY: "auto",
  },
  titleContainer: {
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
type Database = metaStore.DatabaseModel;
type Permission = permissionManager.RoleModel["permissions"][number];

type Props = {
  classes: ReturnType<typeof useStyles>;
  onItemChange: PermissionListItemProps["onChange"];
  onItemDelete: PermissionListItemProps["onDelete"];
  onItemAdd: () => void;
  databaseNames: string[];
  listBottomRef: RefObject<HTMLDivElement>;
} & Omit<ContainerProps, "onChange" | "databases">;
type ContainerProps = {
  title: ReactNode;
  actions: Action[];
  databases: Database[];
  onChange: (newValue: Permission[]) => void;
  permissions: Permission[];
};

const Component = ({
  title,
  classes,
  actions,
  databaseNames,
  permissions,
  onItemChange,
  onItemDelete,
  onItemAdd,
  listBottomRef,
}: Props): JSX.Element => {
  return (
    <div>
      <div className={classes.titleContainer}>
        {title}
        <Spacer direction="horizontal" size="5px" />
        <SquareIconButton icon={<AddCircle />} onClick={onItemAdd} />
      </div>
      <div className={classes.tableContainer}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Databases</TableCell>
              <TableCell>Actions</TableCell>
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
                  databases={databaseNames}
                  onChange={onItemChange}
                  onDelete={onItemDelete}
                />
              );
            })}
          </TableBody>
        </Table>
        {/* FIXME: View port will not contain new permission by executing scrollToBottomOfList, because state will be changed asynchronously.
            So below extra space is needed to scroll to new permission, I think, however there may be a better way
            Do yo have any other method?  */}
        <div className={classes.bottomSpace} />
        <div ref={listBottomRef} />
      </div>
    </div>
  );
};
const Container = ({
  actions,
  databases,
  onChange,
  permissions,
  ...delegated
}: ContainerProps): JSX.Element => {
  const classes = useStyles();
  const listBottomRef = createRef<HTMLDivElement>();

  const scrollToBottomOfList = () => {
    if (listBottomRef && listBottomRef.current) {
      listBottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const databaseNames = databases
    .filter((database) => Boolean(database.name))
    .map((database) => database.name as NonNullable<typeof database.name>);

  const onItemChange: Props["onItemChange"] = (targetIndex, newValue) => {
    const newPermissions = permissions.map((permission, i) =>
      i === targetIndex ? newValue : permission
    );
    onChange(newPermissions);
  };

  const onItemDelete: Props["onItemDelete"] = (targetIndex) => {
    const newPermissions = permissions.filter((_, i) => i !== targetIndex);
    onChange(newPermissions);
  };

  const onItemAdd: Props["onItemAdd"] = () => {
    const newPermissions = [...permissions];
    newPermissions.push({ databases: [], actions: [] });
    onChange(newPermissions);
    scrollToBottomOfList();
  };

  return (
    <Component
      classes={classes}
      actions={actions}
      permissions={permissions}
      databaseNames={databaseNames}
      onItemChange={onItemChange}
      onItemDelete={onItemDelete}
      onItemAdd={onItemAdd}
      listBottomRef={listBottomRef}
      {...delegated}
    />
  );
};

export { Container as PermissionList };
export type { ContainerProps as PermissionListProps };
