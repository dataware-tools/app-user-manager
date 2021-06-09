import { Spacer, getURLParam, addURLParam, resetURLParam } from "../../utils";
import { TabBar } from "@dataware-tools/app-common";
import { useState, useEffect } from "react";
import { UsersEditor } from "../organisms/UsersEditor";
import { RolesEditor } from "../organisms/RolesEditor";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
  },
  tabBarContainer: {
    flex: 0,
  },
  mainContainer: {
    flex: 1,
  },
}));

export const IndexPage = (): JSX.Element => {
  const styles = useStyles();

  // TODO: save tab number to local state
  const tabNames = ["Users", "Roles"];
  const currentTabName = getURLParam("tab") || "Users";
  const [tabNum, setTabNum] = useState(
    tabNames.findIndex((tabName) => tabName === currentTabName)
  );

  const setTabNumByBrowserBack = () => {
    const currentTabName = getURLParam("tab") || "Users";
    setTabNum(tabNames.findIndex((tabName) => tabName === currentTabName));
  };

  useEffect(() => {
    window.addEventListener("popstate", setTabNumByBrowserBack, false);
    return () =>
      window.removeEventListener("popstate", setTabNumByBrowserBack, false);
  }, [setTabNumByBrowserBack]);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.tabBarContainer}>
          <TabBar
            tabNames={tabNames}
            value={tabNum}
            onChange={(newValue) => {
              setTabNum(newValue);
              resetURLParam("push");
              addURLParam(`?tab=${tabNames[newValue]}`, "replace");
            }}
          />
        </div>
        <Spacer direction="horizontal" size="3vw" />
        <div className={styles.mainContainer}>
          {(() => {
            switch (tabNames[tabNum]) {
              case "Users":
                return <UsersEditor />;
              case "Roles":
                return <RolesEditor />;
              default:
                return null;
            }
          })()}
        </div>
        <Spacer direction="horizontal" size="3vw" />
      </div>
    </>
  );
};
