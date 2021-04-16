import { ToolBar } from "../organisms/ToolBar";
import Button from "@material-ui/core/Button";
import { PageWrapper } from "../organisms/PageWrapper";
import { Spacer } from "../../utils";
import { MenuBar } from "../molecules/MenuBar";

export const TestLayout = () => (
  <>
    <PageWrapper>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 0 }}>
          <MenuBar
            tabNames={["test", "test", "test", "test", "test", "test"]}
            value={0}
            onChange={() => {}}
          />
        </div>
        <Spacer direction="horizontal" size="3vw" />
        <div style={{ flex: 1 }}>
          <ToolBar>
            <Button>Test</Button>
            <Spacer direction="horizontal" size={5} />
            <Button>Test</Button>
            <Spacer direction="horizontal" size={5} />
            <Button>Test</Button>
          </ToolBar>
          <Spacer direction="vertical" size="3vh" />
          <div
            style={{
              overflow: "auto",
              minHeight: "40vh",
              maxHeight: "65vh",
            }}
          >
            Scroll down!!
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            End!
          </div>
        </div>
        <Spacer direction="horizontal" size="3vw" />
      </div>
    </PageWrapper>
  </>
);
