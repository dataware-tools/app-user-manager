import {} from "../../utils";
import {
  getQueryString,
  addQueryString,
  resetQueryString,
  PageContainer,
  PageTabBar,
  PageBody,
} from "@dataware-tools/app-common";
import { useState, useEffect } from "react";
import { UsersEditor } from "../organisms/UsersEditor";
import { RolesEditor } from "../organisms/RolesEditor";

export const IndexPage = (): JSX.Element => {
  // TODO: save tab number to local state
  const tabNames = ["Users", "Roles"];
  const currentTabName = getQueryString("tab") || "Users";
  const [tabNum, setTabNum] = useState(
    tabNames.findIndex((tabName) => tabName === currentTabName)
  );

  const setTabNumByBrowserBack = () => {
    const currentTabName = getQueryString("tab") || "Users";
    setTabNum(tabNames.findIndex((tabName) => tabName === currentTabName));
  };

  useEffect(() => {
    window.addEventListener("popstate", setTabNumByBrowserBack, false);
    return () =>
      window.removeEventListener("popstate", setTabNumByBrowserBack, false);
  }, [setTabNumByBrowserBack]);

  return (
    <PageContainer flexDirection="row" padding="0">
      <PageTabBar
        tabNames={tabNames}
        value={tabNum}
        onChange={(newValue) => {
          setTabNum(newValue);
          resetQueryString("push");
          addQueryString(`?tab=${tabNames[newValue]}`, "replace");
        }}
      />
      <PageBody>
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
      </PageBody>
    </PageContainer>
  );
};
