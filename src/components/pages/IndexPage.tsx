import { Spacer } from "../../utils";
import { MenuBar } from "../molecules/MenuBar";
import { useState } from "react";
import { UsersEditor } from "../organisms/UsersEditor";
import { RolesEditor } from "../organisms/RolesEditor";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
  },
  menuBarContainer: {
    flex: 0,
  },
  mainContainer: {
    flex: 1,
  },
}));

export const IndexPage = (): JSX.Element => {
  const tabNames = ["Users", "Roles"];
  // TODO: save tab number to local state
  const [tabNum, setTabNum] = useState(0);
  const styles = useStyles();

  return (
    <>
      <div className={styles.root}>
        <div className={styles.menuBarContainer}>
          <MenuBar
            tabNames={tabNames}
            value={tabNum}
            onChange={(newValue) => {
              setTabNum(newValue);
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
            }
          })()}
        </div>
        <Spacer direction="horizontal" size="3vw" />
      </div>
    </>
  );
};
