// Based on: https://blog.logrocket.com/using-material-ui-with-react-hook-form/
import React from 'react'

import { useController } from 'react-hook-form'

import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { InputAdornment } from '@mui/material'
import { HighlightOff } from '@mui/icons-material'

const FormTextInput = ({
  control,
  id,
  testId,
  name,
  label,
  type,
  multiline,
  rows,
  maxRows,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: true },
  })

  const inputProps = {
    'data-testid': testId,
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          sx={{ width: '5px', height: '2em' }}
          onClick={() => {
            field.onChange('')
          }}
        >
          <HighlightOff />
        </IconButton>
      </InputAdornment>
    ),
  }

  return (
    <TextField
      id={id}
      multiline={multiline}
      rows={rows}
      maxRows={maxRows}
      helperText={error ? error.message : null}
      error={!!error}
      onChange={field.onChange} // send value to hook form
      onBlur={field.onBlur} // notify when input is touched/blur
      value={field.value}
      name={field.name}
      size="small"
      label={label}
      type={type}
      variant="outlined"
      margin="dense"
      fullWidth
      inputRef={field.ref} // send input ref, so we can focus on input when error appears
      InputProps={inputProps}
      sx={{ p: 0 }}
    />
  )
}

export default FormTextInput
