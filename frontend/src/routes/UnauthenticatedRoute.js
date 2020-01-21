import React from "react";
import { Route, Redirect } from "react-router-dom";

// eslint-disable-next-line
export default (
  { component: C, appProps, ...rest } // eslint-disable-line
) => (
  <Route
    {...rest}
    render={props =>
      !appProps.isAuthenticated ? ( // eslint-disable-line
        <C {...props} {...appProps} />
      ) : (
        <Redirect to="/menu" />
      )
    }
  />
);
