import React, { useState } from 'react';
import '../styles/signup.css';
import { withRouter } from "react-router-dom";
import { instance } from '../utils/AxiosConfig';

const SignUp = (props) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value
    });
  };

  const handleSignup = () => {
    const { username, email, password } = form;

    if (!username || !email || !password) {
      alert("Form is incomplete");
      return;
    }

    instance.post('/signup', form)
      .then((response) => {
        if (response.data.Status === "S") {
          alert("Successfully Registered");
          props.history.push("/login"); // ✅ correct
        } else if (response.data.Status === "F") {
          alert("Username or Email already exists");
        }
      })
      .catch(() => {
        alert("Signup failed. Server error.");
      });
  };

  return (
    <div className="container signup">
      <div className="signup-logo">
        <img src={require("../images/logo.png")} alt="" />
      </div>

      <div className="signup-form">
        <h3>INTRODUCE YOURSELF</h3>

        <label>Hi there! My name is</label>
        <input
          id="username"
          className="form-control"
          type="text"
          onChange={handleChange}
        />

        <label>Here’s my email address:</label>
        <input
          id="email"
          className="form-control"
          type="email"
          onChange={handleChange}
        />

        <label>And here’s my password:</label>
        <input
          id="password"
          className="form-control"
          type="password"
          onChange={handleChange}
        />

        <button className="btn" onClick={handleSignup}>
          Sign me up!
        </button>
      </div>
    </div>
  );
};

export default withRouter(SignUp);
