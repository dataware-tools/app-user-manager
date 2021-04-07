import themeInstance from "../../theme";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { SyntheticEvent } from "react";

type MenuBarProps = {
  tabNames: string[];
  onChange: (newValue: number) => void;
  value: number;
};

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  tabs: {
    borderRight: `solid 3px ${theme.palette.divider}`,
    boxSizing: "border-box",
    height: "100%",
  },
  tab: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const MenuBar = ({ tabNames, onChange, value }: MenuBarProps): JSX.Element => {
  const styles = useStyles();
  const _onChange = (e: SyntheticEvent, newValue: number) => {
    onChange(newValue);
  };

  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      onChange={_onChange}
      value={value}
      className={styles.tabs}
    >
      {tabNames.map((tabName) => (
        <Tab key={tabName} label={tabName} className={styles.tab} />
      ))}
    </Tabs>
  );
};

export { MenuBar };
export type { MenuBarProps };
