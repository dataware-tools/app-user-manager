import { Story } from "@storybook/react";
import { RoleList, RoleListProps } from "./RoleList";

export default {
  component: RoleList,
  title: "RoleList",
};

const Template: Story<RoleListProps> = (args) => <RoleList {...args} />;
export const Default = Template.bind({});
Default.args = {
  rows: [
    { name: "user", description: "外部の人", role_id: "1" },
    { name: "internal user", description: "内部の人", role_id: "2" },
    { name: "admin", description: "教員", role_id: "3" },
  ],
  columns: [
    { field: "role_id", type: "number" },
    { field: "name", type: "string" },
    { field: "description" },
  ],
  onDeleteRow: (e: any, detail: any) => {
    console.log("delete!");
    console.log(e);
    console.log(detail);
  },
  onClickRow: (e: any, detail: any) => {
    console.log("click row!");
    console.log(e);
    console.log(detail);
  },
};

const testArgs = {
  rows: [
    { name: "user", description: "外部の人", role_id: "1" },
    { name: "internal user", description: "内部の人", role_id: "2" },
    { name: "admin", description: "教員", role_id: "3" },
    { name: "test", description: "testの人", role_id: "1" },
    { name: "test", description: "testの人", role_id: "1" },
    { name: "test", description: "testの人", role_id: "1" },
    { name: "test", description: "testの人", role_id: "1" },
    { name: "test", description: "testの人", role_id: "1" },
    { name: "test", description: "testの人", role_id: "1" },
    { name: "test", description: "testの人", role_id: "1" },
    { name: "test", description: "testの人", role_id: "1" },
    { name: "test", description: "testの人", role_id: "1" },
    { name: "test", description: "testの人", role_id: "1" },
    { name: "test", description: "testの人", role_id: "1" },
    { name: "test", description: "testの人", role_id: "1" },
    { name: "test", description: "testの人", role_id: "1" },
  ],
  columns: [
    { field: "role_id", type: "number" as const },
    { field: "name", type: "string" as const },
    { field: "description" },
    { field: "description1" },
    { field: "description2" },
    { field: "description3" },
    { field: "description4" },
    { field: "description5" },
    { field: "description6" },
    { field: "description7" },
    { field: "description8" },
    { field: "description9" },
    { field: "description10" },
  ],
  onClickRow: (e: any, detail: any) => {
    console.log("click row!");
    console.log(e);
    console.log(detail);
  },
};

export const StickyHeader = (): JSX.Element => (
  <div style={{ height: "60vh", overflow: "auto" }}>
    <RoleList stickyHeader {...testArgs} />
  </div>
);
