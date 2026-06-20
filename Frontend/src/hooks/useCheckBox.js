import { useState } from "react";

export function useCheckbox(defaultValue = false, validationFn = (v) => v) {
  const [checked, setChecked] = useState(defaultValue);
  const [didEdit, setDidEdit] = useState(false);

  const valueIsValid = validationFn(checked);

  function handleChange(event) {
    setChecked(event.target.checked);
    setDidEdit(true);
  }

  function handleBlur() {
    setDidEdit(true);
  }

  function handleReset() {
    setChecked(defaultValue);
    setDidEdit(false);
  }

  return {
    value: checked,
    checked,
    handleChange,
    handleBlur,
    hasError: didEdit && !valueIsValid,
    reset: handleReset,
  };
}