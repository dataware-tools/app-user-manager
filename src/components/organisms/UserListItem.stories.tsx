import { Story } from "@storybook/react";
import { UserListItem, UserListItemProps } from "./UserListItem";

export default {
  component: UserListItem,
  title: "UserListItem",
};

const Template: Story<UserListItemProps> = (args) => <UserListItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  user: {
    user_id: "user id",
    name: "user name",
    roles: [{ role_id: "1", name: "admin" }],
  },
  roles: [
    { role_id: "1", name: "admin" },
    { role_id: "2", name: "manager" },
  ],
};
