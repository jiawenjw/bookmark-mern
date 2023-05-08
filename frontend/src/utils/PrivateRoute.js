import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children, ...rest }) => {
  const { authToken } = useContext(AuthContext);
  return (
    <Route {...rest}>{!authToken ? <Redirect to="/login" /> : children}</Route>
  );
};
export default PrivateRoute;
