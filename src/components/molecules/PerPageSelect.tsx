import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const PerPageSelect = (): JSX.Element => {
  const [page, setPage] = React.useState('20');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPage(event.target.value as string);
  };

  return (
    <div>
      <FormControl>
        <Select
          labelId="perPage"
          value={page}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="" disabled>
            perPage
          </MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={200}>200</MenuItem>
          <MenuItem value={500}>500</MenuItem>
        </Select>
        <FormHelperText>perPage</FormHelperText>
        </FormControl>

    </div>
  );
};

export { PerPageSelect };
