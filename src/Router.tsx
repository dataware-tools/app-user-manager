import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { PageWrapper } from "@dataware-tools/app-common";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import packageInfo from "../package.json";
import { authConfig, redirectUri } from "./utils/index";
import { IndexPage } from "pages/IndexPage";

const Router = (): JSX.Element | null => {
  const onRedirectCallback = (appState: AppState): void => {
    if (appState?.returnTo) {
      window.location.href = appState.returnTo;
    } else {
      // Remove the code and state parameters from the url
      history.replaceState(
        null,
        "",
        ` ${window.location.origin}${window.location.pathname} `
      );
    }
  };

  return (
    <>
      <BrowserRouter basename={packageInfo.basePath}>
        <Auth0Provider
          domain={authConfig.domain}
          clientId={authConfig.clientId}
          audience={authConfig.apiUrl}
          // @ts-expect-error redirectUri is not undefined in client side.
          redirectUri={redirectUri}
          onRedirectCallback={onRedirectCallback}
        >
          <Switch>
            <PageWrapper repository={packageInfo.repository}>
              <Route exact path="/">
                <IndexPage />
              </Route>
            </PageWrapper>
          </Switch>
        </Auth0Provider>
      </BrowserRouter>
    </>
  );
};

export default Router;
