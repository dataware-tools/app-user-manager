import { Story } from "@storybook/react";
import { PermissionList, PermissionListProps } from "./PermissionList";

export default {
  component: PermissionList,
  title: "PermissionList",
};

const Template: Story<PermissionListProps> = (args) => (
  <PermissionList {...args} />
);
export const Default = Template.bind({});
Default.args = {
  permissions: [
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
    {
      databases: ["test"],
      actions: [{ name: "test", action_id: "1" }],
    },
  ],
  actions: [
    { name: "test", action_id: "1" },
    { name: "foo", action_id: "2" },
    { name: "bar", action_id: "3" },
  ],
  databases: [
    { database_id: "test1", description: "test1", name: "test1" },
    { database_id: "test2", description: "test2", name: "test2" },
    { database_id: "test3", description: "test3", name: "test3" },
  ],
  onChange: (newValue) => console.log(JSON.stringify(newValue)),
};
