import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

type PropsType = { perPage: number; setPerPage: (perPage: number) => void };
const PerPageSelect = ({ perPage, setPerPage }: PropsType): JSX.Element => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPerPage(event.target.value as number);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginRight: "5px",
        }}
      >
        perPage
      </div>
      <Select
        labelId="perPage"
        value={perPage}
        onChange={handleChange}
        displayEmpty
        variant="standard"
      >
        <MenuItem value={20}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
      </Select>
    </div>
  );
};

export { PerPageSelect };
