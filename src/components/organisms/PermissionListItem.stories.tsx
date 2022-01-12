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
  databases: [
    { database_id: "test", name: "Test" },
    { database_id: "foo", name: "Foo" },
    { database_id: "bar", name: "Bar" },
  ],
  onDelete: (index) => {
    console.log("delete!");
    console.log(index);
  },
  onChange: (index, newValue) => {
    console.log("change!");
    console.log(index);
    console.log(newValue);
  },
};
