import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAuth0 } from "@auth0/auth0-react";
import { LoadingIndicator } from "../molecules/LoadingIndicator";
import { ErrorMessage } from "../molecules/ErrorMessage";
import { makeStyles } from "@material-ui/core/styles";

export type PageWrapperProps = {
  children: JSX.Element | JSX.Element[] | string;
};

const useStyles = makeStyles(() => ({
  loadingIndicatorContainer: {
    alignItems: "center",
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    width: "100vw",
  },
  errorMessageContainer: {
    alignItems: "center",
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    width: "100vw",
  },
}));

export const PageWrapper = (props: PageWrapperProps): JSX.Element => {
  const styles = useStyles();
  const { isLoading, error } = useAuth0();
  if (isLoading) {
    return (
      <div className={styles.loadingIndicatorContainer}>
        <LoadingIndicator />
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.errorMessageContainer}>
        <ErrorMessage reason={error.message} />
      </div>
    );
  }
  return (
    <div>
      <Header />
      {props.children}
      <Footer />
    </div>
  );
};
