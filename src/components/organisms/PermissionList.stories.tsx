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
  onAdd: (e: any) => {
    console.log("add!");
    console.log(e);
  },
};
