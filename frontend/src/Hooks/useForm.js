import { useState } from "react";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const isInvalid = (key, newValue) => {
  return key === "email" ? !emailRegex.test(newValue) : newValue === "";
};

const useForm = items => {
  const [formState, setFormState] = useState(items);

  return [
    formState,
    (key, newValue) =>
      setFormState(prev => ({
        ...prev,
        [key]: {
          invalid: isInvalid(key, newValue),
          touched: true,
          value: newValue
        }
      }))
  ];
};

export default useForm;
