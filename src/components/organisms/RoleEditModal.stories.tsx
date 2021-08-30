import Button from "@material-ui/core/Button";
import { useState } from "react";
import { RoleEditModal } from "./RoleEditModal";
import { TestAuthProvider, CONST_STORY_BOOK } from "test-utils";

export default {
  component: RoleEditModal,
  title: "RoleEditModal",
};

export const Default = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <TestAuthProvider>
      <div>
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          open
        </Button>
        <RoleEditModal
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          onSaveSucceeded={() => {
            setOpen(false);
          }}
        />
      </div>
    </TestAuthProvider>
  );
};
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
