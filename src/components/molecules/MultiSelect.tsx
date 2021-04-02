import React, { SyntheticEvent } from "react";
import Select, {
  OptionsType,
  OptionTypeBase,
  ActionMeta,
  InputActionMeta,
  Theme as SelectThemeType,
} from "react-select";
import CreatableSelect from "react-select/creatable";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { isNonNullable } from "../../utils/index";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  deactiveSelect: {
    alignItems: "center",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    flexWrap: "wrap",
    padding: "3px 12px",
    width: "100%",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  deactiveEmptySelect: {
    cursor: "pointer",
    height: "2.7rem",
    width: "100%",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  selectContainer: {
    display: "flex",
    flexDirection: "row",
  },
  select: {
    width: "100%",
  },
  selectedItem: {
    backgroundColor: theme.palette.grey[300],
    borderRadius: "2px",
    boxSizing: "border-box",
    fontSize: "85%",
    margin: "2px 4px 2px 0px",
    overflow: "hidden",
    padding: "4px 6px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
}));

type PropType = {
  currentSelected: OptionsType<OptionTypeBase>;
  haveSaveButton?: boolean;
  isCreatable: boolean;
  isLoading?: boolean;
  onChange: (
    newValue: OptionsType<OptionTypeBase>,
    actionMeta: ActionMeta<OptionTypeBase>
  ) => void;
  options: OptionsType<OptionTypeBase>;
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;
  onMenuScrollToBottom?: (e: SyntheticEvent) => void;
  onSave?: () => void;
  onFocusOut?: () => void;
};

const MultiSelect = ({
  isCreatable,
  currentSelected,
  isLoading,
  onSave,
  onFocusOut,
  haveSaveButton,
  ...delegated
}: PropType): JSX.Element => {
  const styles = useStyles();
  const muiColors = useTheme().palette;
  const [menuIsOpen, setMenuIsOpen] = React.useState<boolean>(false);
  const loadingOptions = isLoading
    ? { isLoading: true, menuShouldBlockScroll: true }
    : {};

  const SaveButton = () => {
    return (
      <Button
        sx={{ ml: 1 }}
        onClick={() => {
          setMenuIsOpen(false);
          if (isNonNullable(onSave)) {
            onSave();
          }
        }}
      >
        Save
      </Button>
    );
  };

  const selectProps = {
    isMulti: true,
    menuIsOpen: true,
    autoFocus: true,
    defaultValue: currentSelected,
    className: styles.select,
    theme: (theme: SelectThemeType) => ({
      ...theme,
      colors: {
        ...theme.colors,
        primary: muiColors.primary.main,
        primary75: muiColors.primary.main,
        primary50: muiColors.primary.main,
        primary25: muiColors.primary.light,
        danger: muiColors.error.main,
        dangerLight: muiColors.error.light,
        neutral0: muiColors.common.white,
        neutral5: muiColors.grey[200],
        neutral10: muiColors.grey[300],
        neutral20: muiColors.grey[300],
        neutral30: muiColors.grey[400],
        neutral40: muiColors.grey[500],
        neutral50: muiColors.grey[600],
        neutral60: muiColors.grey[700],
        neutral70: muiColors.grey[800],
        neutral80: muiColors.grey[900],
        neutral90: muiColors.grey[900],
      },
    }),
    ...delegated,
    ...loadingOptions,
  };

  return menuIsOpen ? (
    <ClickAwayListener
      onClickAway={() => {
        setMenuIsOpen(false);
        if (isNonNullable(onFocusOut)) {
          onFocusOut();
        }
        console.log("click away!!");
      }}
    >
      {isCreatable ? (
        <div className={styles.selectContainer}>
          <CreatableSelect {...selectProps} />
          {haveSaveButton ? <SaveButton /> : null}
        </div>
      ) : (
        <div className={styles.selectContainer}>
          <Select {...selectProps} />
          {haveSaveButton ? <SaveButton /> : null}
        </div>
      )}
    </ClickAwayListener>
  ) : (
    <div
      className={
        currentSelected.length > 0
          ? styles.deactiveSelect
          : styles.deactiveEmptySelect
      }
      onClick={() => setMenuIsOpen(true)}
    >
      {currentSelected.map((option) => {
        return (
          <div key={option.value} className={styles.selectedItem}>
            {option.label}
          </div>
        );
      })}
    </div>
  );
};

export { MultiSelect };
export type { PropType as MultiSelectPropType };
