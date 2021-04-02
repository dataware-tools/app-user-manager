import { Story } from "@storybook/react";
import { PerPageSelect } from "./PerPageSelect";

export default {
  component: PerPageSelect,
  title: "PerPageSelect",
};

const Template: Story = (args) => <PerPageSelect {...args} />;
export const Default = Template.bind({});
Default.args = {
  setPerPage: (newValue: number) => {
    console.log(newValue);
  },
};
