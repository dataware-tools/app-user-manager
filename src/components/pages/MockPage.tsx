import { PageWrapper } from "../organisms/PageWrapper";
import { Spacer } from "../../utils";
import { MenuBar } from "../molecules/MenuBar";
import { useState } from "react";
import { UsersEditor } from "../organisms/MockUsersEditor";
import { RolesEditor } from "../organisms/MockRolesEditor";

export const TopPage = (): JSX.Element => {
  const tabNames = ["Users", "Roles"];
  // TODO: save tab number to local state
  const [tabNum, setTabNum] = useState(0);
  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 0 }}>
          <MenuBar
            tabNames={tabNames}
            value={tabNum}
            onChange={(newValue) => {
              setTabNum(newValue);
            }}
          />
        </div>
        <Spacer axis="horizontal" size="3vw" />
        <div style={{ flex: 1 }}>
          {(() => {
            switch (tabNames[tabNum]) {
              case "Users":
                return <UsersEditor />;
              case "Roles":
                return <RolesEditor />;
            }
          })()}
        </div>
        <Spacer axis="horizontal" size="3vw" />
      </div>
    </>
  );
};
