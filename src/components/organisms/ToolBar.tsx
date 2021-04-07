import { makeStyles } from "@material-ui/core/styles";
import themeInstance from "../../theme";
import { ReactNode } from "react";

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  toolBar: {
    justifyContent: "space-between",
    overflow: "auto",
  },
  span: {
    flex: 1,
  },
  toolsContainer: {
    alignItems: "center",
    display: "flex",
    flex: 0,
    justifyContent: "flex-end",
  },
}));

type ToolBarProps = {
  children: ReactNode;
};

const ToolBar = ({ children }: ToolBarProps): JSX.Element => {
  const styles = useStyles();
  return (
    <>
      <div className={styles.toolBar}>
        <span className={styles.span} />
        <div className={styles.toolsContainer}>{children}</div>
      </div>
    </>
  );
};

export { ToolBar };
export type { ToolBarProps };
