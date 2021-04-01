import { API_CATALOG, FetchStatus, fetchApi } from "@dataware-tools/app-common";
import { Button, Container } from "@material-ui/core";

import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

const apiURL: string =
  (process.env.REACT_APP_BACKEND_API_PREFIX || "/api/latest") +
  API_CATALOG.authTest.endpoint;

const Sample = (): JSX.Element => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [apiResult, setApiResult] = useState<any>(undefined);

  return (
    <div>
      <h1>Hello {user ? user.name : "world"}</h1>
      <Button
        variant="contained"
        disableElevation
        onClick={() => {
          getAccessTokenSilently().then((accessToken: string) => {
            fetchApi(apiURL, accessToken, setApiResult);
          });
        }}
      >
        Test API
      </Button>
      <FetchStatus {...apiResult} />
      {apiResult && apiResult.isFetchDone && (
        <Container maxWidth="sm">{JSON.stringify(apiResult)}</Container>
      )}
    </div>
  );
};

export { Sample };
