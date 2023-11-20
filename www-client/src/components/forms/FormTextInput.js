// Based on: https://blog.logrocket.com/using-material-ui-with-react-hook-form/
import React from 'react'

import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { useController } from 'react-hook-form'
import { InputAdornment } from '@mui/material'
import { HighlightOff } from '@mui/icons-material'

function Input({ control, id, testId, name, label, type }) {
  const {
    field,
    fieldState: { error },
    //fieldState: { invalid, isTouched, isDirty },
    //formState: { touchedFields, dirtyFields },
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
      helperText={error ? error.message : null}
      error={!!error}
      onChange={field.onChange} // send value to hook form
      onBlur={field.onBlur} // notify when input is touched/blur
      value={field.value} // input value
      name={field.name} // send down the input name
      size="small"
      label={label}
      type={type}
      variant="outlined"
      margin="dense"
      fullWidth
      inputRef={field.ref} // send input ref, so we can focus on input when error appear
      InputProps={inputProps}
    />
  )
}

export default Input
