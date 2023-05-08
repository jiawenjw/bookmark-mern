import { createContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("authToken")
  );

  const history = useHistory();

  const loginUser = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });

    const data = await response.json();
    if (response.status === 200) {
      setAuthToken(data.token);
      localStorage.setItem("authToken", data.token);
      history.push("/");
    } else {
      alert("Incorrect username or password!");
    }
  };

  const logoutUser = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
    history.push("/login");
  };

  let contextData = {
    loginUser: loginUser,
    logoutUser: logoutUser,
    authToken: authToken,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
