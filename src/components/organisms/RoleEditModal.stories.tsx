import { Story } from "@storybook/react";
import { useState } from "react";
import { RoleEditModal, RoleEditModalProps } from "./RoleEditModal";
import Button from "@material-ui/core/Button";

export default {
  component: RoleEditModal,
  title: "RoleEditModal",
};

const Template: Story<RoleEditModalProps> = (args) => (
  <RoleEditModal {...args} />
);
export const Default = () => {
  const [open, setOpen] = useState(false);
  return (
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
      />
    </div>
  );
};
