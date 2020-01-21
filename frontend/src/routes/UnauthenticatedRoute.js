import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

const UnauthenticatedRoute = ({ component: C, appProps, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !appProps.isAuthenticated ? (
        <C {...props} {...appProps} />
      ) : (
        <Redirect to="/menu" />
      )
    }
  />
);

UnauthenticatedRoute.propTypes = {
  component: PropTypes.object.isRequired,
  appProps: PropTypes.object.isRequired
};

export default UnauthenticatedRoute;
