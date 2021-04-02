import React from "react";
import { MultiSelect, MultiSelectPropType } from "./MultiSelect";
import { Story } from "@storybook/react";

export default {
  component: MultiSelect,
  title: "MultiSelect",
};

const Template: Story<MultiSelectPropType> = (args) => (
  <MultiSelect {...args} />
);

const templateOptions = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const templateInitialSelected = [{ value: "chocolate", label: "Chocolate" }];

export const Default = Template.bind({});
Default.args = {
  options: templateOptions,
  isCreatable: false,
  currentSelected: templateInitialSelected,
};

export const Creatable = Template.bind({});
Creatable.args = {
  options: templateOptions,
  isCreatable: true,
  currentSelected: templateInitialSelected,
};

const ComponentFetchWhenEveryInputChangedAndMenuScrolledToBottom = () => {
  const addOptionLength = 100;

  const [selectedOptions, setSelectedOptions] = React.useState<
    Array<Record<string, unknown>>
  >([
    {
      value: 1,
      label: "1",
    },
  ]);
  type optionType = Array<{ value: number; label: string }>;
  const [currentOptions, setCurrentOptions] = React.useState<optionType>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchValue, setSearchValue] = React.useState("");
  const [needAddingOptions, setNeedAddingOptions] = React.useState(false);

  // don't care about implementation of fetchOptions
  const fetchOptions = async (
    startNum: number,
    numOfOptions: number,
    inputValue: string
  ) => {
    const options = [];
    const fetchTime = 3000 * Math.random();
    for (let i = startNum; i < startNum + numOfOptions; i++) {
      options.push({
        value: i,
        label: `${inputValue}${i}`,
      });
    }
    await new Promise((resolve) => setTimeout(resolve, fetchTime));
    return options.filter((options) =>
      options.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const initializeOptions = async (inputValue: string) => {
    setIsLoading(true);
    const newOptions = await fetchOptions(0, addOptionLength, inputValue);
    setCurrentOptions(newOptions);
    setIsLoading(false);
  };

  const fetchAdditionalOptions = async (
    prevLength: number,
    inputValue: string
  ) => {
    setIsLoading(true);
    const additionalOptions = await fetchOptions(
      prevLength,
      addOptionLength,
      inputValue
    );
    setCurrentOptions((prev) => [...prev, ...additionalOptions]);
    setIsLoading(false);
  };

  React.useEffect(() => {
    initializeOptions(searchValue);
  }, [searchValue]);

  React.useEffect(() => {
    if (needAddingOptions === true) {
      fetchAdditionalOptions(currentOptions.length, searchValue);
      setNeedAddingOptions(false);
    }
  }, [needAddingOptions]);

  return (
    <MultiSelect
      options={currentOptions}
      isCreatable
      onChange={(currentValues) => {
        setSelectedOptions([...currentValues]);
      }}
      onMenuScrollToBottom={() => {
        setNeedAddingOptions(true);
      }}
      onInputChange={(newInput) => {
        setSearchValue(newInput);
      }}
      isLoading={isLoading}
      currentSelected={[...selectedOptions]}
    />
  );
};

export const fetchWhenEveryInputChangedAndScrollToBottom = (): JSX.Element => (
  <ComponentFetchWhenEveryInputChangedAndMenuScrolledToBottom />
);

const ComponentFetchWhenEveryInputChangedAndMenuScrolledToBottomAndHaveSaveButton = () => {
  const addOptionLength = 100;

  type optionType = Array<{ value: number; label: string }>;
  const [selectedOptions, setSelectedOptions] = React.useState<optionType>([
    {
      value: 1,
      label: "1",
    },
  ]);
  const [prevSelected, setPrevSelected] = React.useState<optionType>([
    {
      value: 1,
      label: "1",
    },
  ]);
  const [currentOptions, setCurrentOptions] = React.useState<optionType>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSavable, setIsSavable] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [needAddingOptions, setNeedAddingOptions] = React.useState(false);

  // don't care about implementation of fetchOptions
  const fetchOptions = async (
    startNum: number,
    numOfOptions: number,
    inputValue: string
  ) => {
    const options = [];
    const fetchTime = 3000 * Math.random();
    for (let i = startNum; i < startNum + numOfOptions; i++) {
      options.push({
        value: i,
        label: `${inputValue}${i}`,
      });
    }
    await new Promise((resolve) => setTimeout(resolve, fetchTime));
    return options.filter((options) =>
      options.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const initializeOptions = async (inputValue: string) => {
    setIsLoading(true);
    const newOptions = await fetchOptions(0, addOptionLength, inputValue);
    setCurrentOptions(newOptions);
    setIsLoading(false);
  };

  const fetchAdditionalOptions = async (
    prevLength: number,
    inputValue: string
  ) => {
    setIsLoading(true);
    const additionalOptions = await fetchOptions(
      prevLength,
      addOptionLength,
      inputValue
    );
    setCurrentOptions((prev) => [...prev, ...additionalOptions]);
    setIsLoading(false);
  };

  const onSave = () => {
    setPrevSelected([...selectedOptions]);
  };

  const onChange = (newInput: optionType) => {
    setSelectedOptions([...newInput]);
  };

  const onFocusOut = () => {
    setSelectedOptions([...prevSelected]);
  };

  React.useEffect(() => {
    initializeOptions(searchValue);
  }, [searchValue]);

  React.useEffect(() => {
    if (needAddingOptions === true) {
      fetchAdditionalOptions(currentOptions.length, searchValue);
      setNeedAddingOptions(false);
    }
  }, [needAddingOptions]);

  React.useEffect(() => {
    if (JSON.stringify(selectedOptions) !== JSON.stringify(prevSelected)) {
      setIsSavable(true);
    } else {
      setIsSavable(false);
    }
  }, [selectedOptions, prevSelected]);

  return (
    <MultiSelect
      options={currentOptions}
      isCreatable
      onChange={onChange}
      onMenuScrollToBottom={() => {
        setNeedAddingOptions(true);
      }}
      onInputChange={(newInput) => {
        setSearchValue(newInput);
      }}
      isLoading={isLoading}
      currentSelected={[...selectedOptions]}
      onSave={onSave}
      onFocusOut={onFocusOut}
      haveSaveButton={isSavable}
    />
  );
};

export const FetchWhenEveryInputChangedAndMenuScrolledToBottomAndHaveSaveButton = (): JSX.Element => (
  <ComponentFetchWhenEveryInputChangedAndMenuScrolledToBottomAndHaveSaveButton />
);

// const createLongOptions = (startNum: number, numOfOptions: number) => {
//   const options = [];
//   for (let i = startNum; i < startNum + numOfOptions; i++) {
//     options.push({ value: i, label: `${i}` });
//   }
//   return options;
// };

// const handredOptions = createLongOptions(0, 100);
// const thousandOptions = createLongOptions(0, 1000);
// const threeThousandOptions = createLongOptions(0, 3000);
// const tenThousandOptions = createLongOptions(0, 10000);

// export const HaveHandredOptions = Template.bind({});
// HaveHandredOptions.args = {
//   options: handredOptions,
//   currentSelected: templateInitialSelected,
// };

// export const HaveThousandOptions = Template.bind({});
// HaveThousandOptions.args = {
//   options: thousandOptions,
//   currentSelected: templateInitialSelected,
// };

// export const HaveThreeThousandOptions = Template.bind({});
// HaveThreeThousandOptions.args = {
//   options: threeThousandOptions,
//   currentSelected: templateInitialSelected,
// };

// export const HaveTenThousandOptions = Template.bind({});
// HaveTenThousandOptions.args = {
//   options: tenThousandOptions,
//   currentSelected: templateInitialSelected,
// };
