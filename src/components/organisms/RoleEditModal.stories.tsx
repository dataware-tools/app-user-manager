import { useState } from "react";
import { RoleEditModal } from "./RoleEditModal";
import Button from "@material-ui/core/Button";

export default {
  component: RoleEditModal,
  title: "RoleEditModal",
};

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
        onSave={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};
