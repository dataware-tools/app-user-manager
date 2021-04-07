import { Story } from "@storybook/react";
import {
  PermissionListItem,
  PermissionListItemProps,
} from "./PermissionListItem";

export default {
  component: PermissionListItem,
  title: "PermissionListItem",
};

const Template: Story<PermissionListItemProps> = (args) => (
  <PermissionListItem {...args} />
);
export const Default = Template.bind({});
Default.args = {
  index: 0,
  permission: {
    databases: ["test"],
    actions: [{ name: "test", action_id: "1" }],
  },
  actions: [
    { name: "test", action_id: "1" },
    { name: "foo", action_id: "2" },
    { name: "bar", action_id: "3" },
  ],
  databases: ["test", "foo", "bar"],
  onDelete: (e: any, index: any) => {
    console.log("delete!");
    console.log(e);
    console.log(index);
  },
  onChange: (index: any, newValue: any) => {
    console.log("change!");
    console.log(index);
    console.log(newValue);
  },
};