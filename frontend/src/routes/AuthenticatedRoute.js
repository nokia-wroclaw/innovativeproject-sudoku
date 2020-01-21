import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function AuthenticatedRoute({
  component: C, // eslint-disable-line
  appProps, // eslint-disable-line
  ...rest // eslint-disable-line
}) {
  return (
    <Route
      {...rest}
      render={props =>
        appProps.isAuthenticated ? ( // eslint-disable-line
          <C {...props} {...appProps} />
        ) : (
          <Redirect
            to={`/login?redirect=${props.location.pathname}${props.location.search}`} // eslint-disable-line
          />
        )
      }
    />
  );
}
