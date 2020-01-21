import { useState } from "react";
import { useHistory } from "react-router";

const useNavigation = modalPath => {
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const goBack = () => {
    if (history.location.pathname === modalPath) {
      return open ? history.push("/menu") : setOpen(true);
    }
    history.goBack();
    return setOpen(false);
  };

  return [open, newValue => setOpen(newValue), goBack];
};

export default useNavigation;
