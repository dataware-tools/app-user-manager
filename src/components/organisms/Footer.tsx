import { makeStyles } from "@material-ui/core/styles";
import themeInstance from "../../theme";
import Link from "@material-ui/core/Link";
import Divider from "@material-ui/core/Divider";
import { repository } from "../../../package.json";

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  footer: {
    color: theme.palette.text.secondary,
    marginLeft: "10vw",
    marginRight: "10vw",
  },
  footerBody: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
  },
}));

export const Footer = (): JSX.Element => {
  const styles = useStyles();
  return (
    <div className={styles.footer}>
      <Divider variant="middle" sx={{ mt: "3vh", mb: "1vh" }} />
      <div className={styles.footerBody}>
        <div className={styles.leftContainer}>
          <Link
            variant="body2"
            color="inherit"
            href="http://www.hdwlab.co.jp"
            target="_blank"
            rel="noopener noreferrer"
          >
            &copy; Human Dataware Lab.
          </Link>
        </div>
        <div className={styles.rightContainer}>
          <Link
            variant="body2"
            color="inherit"
            href={repository}
            target="_blank"
            rel="noopener noreferrer"
          >
            GithHub
          </Link>
        </div>
      </div>
    </div>
  );
};
