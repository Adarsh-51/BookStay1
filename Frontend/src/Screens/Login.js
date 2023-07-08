import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../Components/Loading";
import Error from "../Components/Error";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  async function login() {
    const user = {
      email,
      password,
    };
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      const result = response.data;
      setLoading(false);

      localStorage.setItem("currentUser", JSON.stringify(result));
      window.location.href = "/home";
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  }

  return (
    <div>
      {loading && <Loading />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {error && <Error message={"Invalid Credentials"} />}
          <div className="bs text-align-center">
            <h2>Login</h2>
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button className="btn btn-primary mt-3" onClick={login}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
