import React from "react";
import { SearchForm, SearchPropType } from "./SearchForm";
import { Story } from "@storybook/react";

export default {
  component: SearchForm,
  title: "SearchForm",
};

const Template: Story<SearchPropType> = (args) => <SearchForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  onSearch: () => {},
  onSearchTextChange: () => {},
  searchText: "",
};

const ComponentChangable = (): JSX.Element => {
  const [searchText, setSearchText] = React.useState("change this text");
  const onSearch = () => {
    console.log(`search "${searchText}"!!`);
  };
  const onSearchTextChange = (newSearchText: string) => {
    setSearchText(newSearchText);
  };

  return (
    <SearchForm
      searchText={searchText}
      onSubmit={onSearch}
      onChange={onSearchTextChange}
    />
  );
};

export const Changable = (): JSX.Element => <ComponentChangable />;
