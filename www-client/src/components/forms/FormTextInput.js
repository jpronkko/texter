// Based on: https://blog.logrocket.com/using-material-ui-with-react-hook-form/
import React from 'react'

import TextField from '@mui/material/TextField'
import { useController } from 'react-hook-form'

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

  const inputProps = { 'data-testid': testId }

  return (
    <TextField
      id={id}
      helperText={error ? error.message : null}
      error={!!error}
      onChange={field.onChange} // send value to hook form
      onBlur={field.onBlur} // notify when input is touched/blur
      value={field.value} // input value
      name={field.name} // send down the input name
      size='small'
      label={label}
      type={type}
      variant='outlined'
      inputRef={field.ref} // send input ref, so we can focus on input when error appear
      inputProps={inputProps}
    />
  )
}

export default Input