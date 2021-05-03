import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { useState } from "react";

type SearchPropType = {
  onSearch: (searchText: string) => void;
  defaultValue?: string;
  value?: string;
};

const SearchForm = ({
  onSearch,
  defaultValue,
  value,
}: SearchPropType): JSX.Element => {
  const [searchText, setSearchText] = useState(defaultValue || "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(searchText);
      }}
    >
      <OutlinedInput
        size="small"
        placeholder="Search..."
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              edge="end"
              onClick={() => onSearch(searchText)}
              size="small"
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchText(event.target.value);
        }}
        value={value != null ? value : searchText}
      />
    </form>
  );
};

export { SearchForm };
export type { SearchPropType };
