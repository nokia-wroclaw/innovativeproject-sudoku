import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

const AuthenticatedRoute = ({ component: C, appProps, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        appProps.isLoggedIn ? (
          <C {...props} {...appProps} />
        ) : (
          <Redirect
            to={`/login?redirect=${props.location.pathname}${props.location.search}`} // eslint-disable-line
          />
        )
      }
    />
  );
};

AuthenticatedRoute.propTypes = {
  component: PropTypes.object.isRequired,
  appProps: PropTypes.object.isRequired
};

export default AuthenticatedRoute;
