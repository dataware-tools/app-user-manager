import { useState } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { makeStyles } from "@material-ui/core/styles";
import LoadingButton from "@material-ui/lab/LoadingButton";
import Autocomplete, {
  AutocompleteProps,
  createFilterOptions,
} from "@material-ui/core/Autocomplete";
import ClearIcon from "@material-ui/icons/Clear";
import themeInstance from "../../theme";
import { TextField } from "@material-ui/core";

const selectedItemStyleBase = {
  backgroundColor: themeInstance.palette.grey[300],
  borderRadius: "2px" as const,
  boxSizing: "border-box" as const,
  fontSize: "85%" as const,
  margin: "2px 4px 2px 0px" as const,
  overflow: "hidden" as const,
  textOverflow: "ellipsis" as const,
  whiteSpace: "nowrap" as const,
};

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  deactiveSelect: {
    alignItems: "center",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    flexWrap: "wrap",
    padding: "6px",
    width: "100%",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  deactiveEmptySelect: {
    alignItems: "center",
    borderRadius: "4px",
    color: theme.palette.text.disabled,
    cursor: "pointer",
    display: "flex",
    height: "40px",
    paddingLeft: "1rem",
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
  selectedItem: { ...selectedItemStyleBase, padding: "2px 6px" },
}));

type MultiSelectPropType<
  T,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = {
  onSave?: () => Promise<void> | void;
  onFocusOut?: () => Promise<void> | void;
  saveOnFocusOut?: boolean;
  options: T[];
  disableClearable?: DisableClearable;
  freeSolo?: FreeSolo;
} & Partial<AutocompleteProps<T, true, DisableClearable, FreeSolo>>;

const MultiSelect = <
  T,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>({
  onSave,
  onFocusOut,
  saveOnFocusOut = true,
  value,
  getOptionLabel,
  ...delegated
}: MultiSelectPropType<T, DisableClearable, FreeSolo>): JSX.Element => {
  const styles = useStyles();
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const save = async () => {
    if (onSave) {
      setIsSaving(true);
      await onSave();
      setIsSaving(false);
    }
  };

  const saveButtonId = `MultiSelect-SaveButton-value-${JSON.stringify(value)}`;
  const SaveButton = () => {
    return (
      <LoadingButton
        id={saveButtonId}
        pending={isSaving}
        sx={{ ml: 1 }}
        onClick={async () => {
          await save();
          setIsSelectFocused(false);
        }}
      >
        Save
      </LoadingButton>
    );
  };

  return isSelectFocused ? (
    <ClickAwayListener
      onClickAway={() => {
        if (saveOnFocusOut) {
          save();
        }
        if (onFocusOut) {
          onFocusOut();
        }
        setIsSelectFocused(false);
      }}
    >
      <div className={styles.selectContainer}>
        <Autocomplete
          {...delegated}
          value={value}
          multiple
          open={menuOpen}
          onOpen={() => setMenuOpen(true)}
          onClose={async (e, reason) => {
            if (
              reason === "escape" ||
              reason === "toggleInput" ||
              reason === "blur"
            ) {
              setMenuOpen(false);
            }
            const saveButton = document.getElementById(saveButtonId);

            // @ts-expect-error I don't know how to resolve this
            if (saveButton && e.relatedTarget === saveButton) {
              await save();
              setIsSelectFocused(false);
            }
          }}
          ChipProps={{
            style: { ...selectedItemStyleBase },
            deleteIcon: <ClearIcon />,
          }}
          size="small"
          renderInput={(params) => <TextField {...params} autoFocus />}
          getOptionLabel={getOptionLabel}
        />
        {onSave ? <SaveButton /> : null}
      </div>
    </ClickAwayListener>
  ) : (
    <div
      className={
        value && value.length > 0
          ? styles.deactiveSelect
          : styles.deactiveEmptySelect
      }
      onClick={() => {
        setIsSelectFocused(true);
        setMenuOpen(true);
      }}
    >
      {value && value.length > 0 ? (
        value.map((option, index) => {
          return (
            <div key={index} className={styles.selectedItem}>
              {getOptionLabel
                ? // @ts-expect-error I don't know how to resolve this error
                  getOptionLabel(option)
                : // @ts-expect-error I don't know how to resolve this error
                  option.label}
            </div>
          );
        })
      ) : (
        <div>Select...</div>
      )}
    </div>
  );
};

export { MultiSelect, createFilterOptions };
export type { MultiSelectPropType };
