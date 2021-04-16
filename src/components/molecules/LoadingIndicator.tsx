import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

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

const LoadingIndicator = (): JSX.Element => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <CircularProgress />
    </div>
  );
};

export { LoadingIndicator };
