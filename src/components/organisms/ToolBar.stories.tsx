import { ToolBar } from "./ToolBar";
import Button from "@material-ui/core/Button";
import { Spacer } from "../../utils";

export default {
  component: ToolBar,
  title: "ToolBar",
};

export const Default = () => (
  <ToolBar>
    <Button>Test</Button>
    <Spacer axis="horizontal" size={5} />
    <Button>Test</Button>
    <Spacer axis="horizontal" size={5} />
    <Button>Test</Button>
  </ToolBar>
);
