import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { Data } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const context = useContext(Data);

  if (!context) {
    throw new Error("This component must be wrapped in AuthContext");
  }

  const { login } = context;

  const [userdet, setuserdet] = useState({
    Email: "",
    Password: "",
  });

  const [submitted, setsubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handlechange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    // Clear the error the moment they start correcting it. Without this the
    // red message sat there while the user retyped a field they'd already
    // fixed, which reads as "still wrong" when it isn't.
    setFormError("");

    setuserdet((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlesubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setsubmitted(true);

    if (userdet.Email.trim().length === 0 || userdet.Password.trim().length === 0) {
      setFormError("Email and password are required");
      return;
    }

    const success = login(userdet.Email, userdet.Password);

    if (!success) {
      // Deliberately generic — doesn't reveal whether the email exists
      // or the password was wrong, which is standard practice.
      setFormError("Invalid email or password");
      return;
    }

    setFormError("");
    setuserdet({
      Email: "",
      Password: "",
    });

    navigate("/profile");
  };

  const handlemove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate("/entry");
  }

  return (
    <div className="login-page">
      <section className="login-hero">
        <p>Discover new things on Superapp</p>
      </section>

      <form className="login-card" onSubmit={handlesubmit}>
        <h1>Super app</h1>
        <p className="login-subtitle">Log in to your account</p>
        <input
          type="text"
          name="Email"
          placeholder="Email"
          value={userdet.Email}
          onChange={handlechange}
        />

        <input
          type="password"
          name="Password"
          placeholder="Password"
          value={userdet.Password}
          onChange={handlechange}
        />

        {submitted && formError && (
          <p className="field-error">{formError}</p>
        )}

        <button type="submit">LOG IN</button>
        <label>Not a user? <a href='/entry' onClick={handlemove}>Register here</a></label>
      </form>
    </div>
  );
};

export default LoginPage;