import { Story } from "@storybook/react";
import { useState } from "react";
import { PerPageSelect } from "./PerPageSelect";

export default {
  component: PerPageSelect,
  title: "PerPageSelect",
};

export const Default: Story = () => {
  const [perPage, setPerPage] = useState(20);
  return <PerPageSelect perPage={perPage} setPerPage={setPerPage} />;
};
