import { Story } from "@storybook/react";
import { SearchForm, SearchPropType } from "./SearchForm";

export default {
  component: SearchForm,
  title: "SearchForm",
};

const Template: Story<SearchPropType> = (args) => <SearchForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  onSearch: (searchText) => window.alert(`${searchText}`),
};
