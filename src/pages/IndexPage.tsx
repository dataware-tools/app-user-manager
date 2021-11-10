import {} from "../utils";
import {
  getQueryString,
  addQueryString,
  resetQueryString,
  PageContainer,
  PageTabBar,
  PageBody,
} from "@dataware-tools/app-common";
import { useState, useEffect } from "react";
import { RolesPage } from "../components/organisms/RolesPage";
import { UsersPage } from "../components/organisms/UsersPage";

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
        sx={{ minWidth: "10vw" }}
      />
      <PageBody>
        {(() => {
          switch (tabNames[tabNum]) {
            case "Users":
              return <UsersPage />;
            case "Roles":
              return <RolesPage />;
            default:
              return null;
          }
        })()}
      </PageBody>
    </PageContainer>
  );
};
