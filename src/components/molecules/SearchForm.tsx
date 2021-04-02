import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import OutlinedInput from "@material-ui/core/OutlinedInput";

type PropType = {
  onSubmit: () => void;
  searchText: string;
  onChange: (newSearchtext: string) => void;
};

const SearchForm = (props: PropType): JSX.Element => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit();
      }}
    >
      <OutlinedInput
        placeholder="Search..."
        endAdornment={
          <InputAdornment position="end">
            <IconButton edge="end" onClick={props.onSubmit}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          props.onChange(event.target.value);
        }}
        value={props.searchText}
      />
    </form>
  );
};

export { SearchForm };
export type { PropType as SearchPropType };
