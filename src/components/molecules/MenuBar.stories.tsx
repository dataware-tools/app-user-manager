import { Story } from "@storybook/react";
import { useState } from "react";
import { MenuBar, MenuBarProps } from "./MenuBar";

export default {
  component: MenuBar,
  title: "MenuBar",
};

const Template: Story<MenuBarProps> = (args) => <MenuBar {...args} />;
const defaultTabNames = ["foo", "bar"];
export const Default = Template.bind({});
Default.args = {
  tabNames: defaultTabNames,
  onChange: (newValue: number) => {
    console.log(defaultTabNames[newValue]);
  },
  value: 0,
};

const ComponentControlled = () => {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 0 }}>
        <MenuBar
          tabNames={defaultTabNames}
          onChange={(newValue) => {
            setCurrentTab(newValue);
          }}
          value={currentTab}
        />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {defaultTabNames[currentTab]}!!
      </div>
    </div>
  );
};

export const Controlled = (): JSX.Element => <ComponentControlled />;
