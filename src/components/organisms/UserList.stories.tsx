import { Story } from "@storybook/react";
import { UserList, UserListProps } from "./UserList";

export default {
  component: UserList,
  title: "UserList",
};

const Template: Story<UserListProps> = (args) => <UserList {...args} />;

export const Default = Template.bind({});
Default.args = {
  users: [
    {
      user_id: "1",
      name: "Toshimitsu Watanabe",
      roles: [{ role_id: "1", name: "admin" }],
    },
    {
      user_id: "2",
      name: "Tomotaka Watanabe",
      roles: [{ role_id: "2", name: "manager" }],
    },
  ],
  roles: [
    { role_id: "1", name: "admin" },
    { role_id: "2", name: "manager" },
    { role_id: "3", name: "producer" },
    { role_id: "4", name: "user" },
    { role_id: "5", name: "engineer" },
    { role_id: "6", name: "tester" },
  ],
};