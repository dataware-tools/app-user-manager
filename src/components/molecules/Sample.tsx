import {
  FetchStatus,
  fetchApi,
  databaseStore,
} from "@dataware-tools/app-common";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import themeInstance from "../../theme";
import { makeStyles } from "@material-ui/core/styles";
import { API_ROUTE } from "../../utils";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  button: {
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
}));

const Sample = (): JSX.Element => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [apiResult, setApiResult] = useState<any>(undefined);
  const styles = useStyles();

  return (
    <div>
      <h1>Hello {user ? user.name : "world"}</h1>
      <Button
        className={styles.button}
        onClick={() => {
          getAccessTokenSilently().then((accessToken: string) => {
            databaseStore.OpenAPI.TOKEN = accessToken;
            databaseStore.OpenAPI.BASE = API_ROUTE.DATABASE.BASE;
            fetchApi(
              databaseStore.DatabaseService.listDatabases(),
              undefined,
              setApiResult
            );
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
