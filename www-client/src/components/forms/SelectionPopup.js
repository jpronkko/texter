import React, { useEffect, useState } from 'react'
import { MenuItem, Select } from '@mui/material'
import FormControl from '@mui/material/FormControl'

const SelectionPopup = ({
  defaultValue,
  selectionValues,
  handleSelectionChange,
}) => {
  const [selected, setSelected] = useState('')

  useEffect(() => {
    setSelected(defaultValue)
  }, [defaultValue])

  const handleChange = (event) => {
    setSelected(event.target.value)
    handleSelectionChange(event.target.value)
  }

  return (
    <FormControl
      sx={{ m: 1, minWidth: 90 }}
      size="small"
      variant="standard"
    >
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={selected}
        label="Age"
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
      >
        {selectionValues.map((item) => (
          <MenuItem
            key={item}
            value={item}
          >
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectionPopup
