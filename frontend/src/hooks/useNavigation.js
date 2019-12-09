import { useState } from "react";
import { useHistory } from "react-router";

const useNavigation = modalPath => {
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const handler = newValue => {
    if (newValue) {
      if (history.location.pathname === modalPath) {
        return true;
      }
      history.goBack();
    }
    return false;
  };

  return [open, newValue => setOpen(handler(newValue))];
};

export default useNavigation;
