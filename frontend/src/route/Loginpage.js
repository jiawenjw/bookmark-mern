import React, { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginUser } = useContext(AuthContext);

  return (
    <div className="identity_page login_page">
      <div className="identity_image"></div>

      <div className="identity_content">
        <div className="identity_content_container">
          <div className="identity_content_bg"></div>
          <form className="identity_form" onSubmit={loginUser}>
            <div className="profile">
              <FontAwesomeIcon icon={["far", "user"]} />
            </div>
            <div className="form_control identity first">
              <div className="identity_icon">
                <FontAwesomeIcon icon="envelope" />
              </div>
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Email ID"
              />
            </div>
            <div className="form_control identity">
              <div className="identity_icon">
                <FontAwesomeIcon icon="lock" />
              </div>

              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Password"
              />
            </div>

            <input type="submit" value="LOGIN" className="identity_button" />
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                color: "#375174",
                fontWeight: "bold",
              }}
            >
              Don't have an account? Register here.
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
