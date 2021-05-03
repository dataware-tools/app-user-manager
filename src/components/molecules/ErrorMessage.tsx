import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/core/Alert";
import AlertTitle from "@material-ui/core/AlertTitle";

const useStyles = makeStyles(() => ({
  root: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    overflow: "auto",
    width: "100%",
  },
}));

type ErrorMessageProps = {
  reason?: string;
  instruction?: string;
};

const ErrorMessage = ({
  reason,
  instruction,
}: ErrorMessageProps): JSX.Element => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {reason ? <div>{reason}</div> : null}
        {instruction ? (
          <div>
            <strong>{instruction}</strong>
          </div>
        ) : null}
      </Alert>
    </div>
  );
};

export { ErrorMessage };
export type { ErrorMessageProps };
