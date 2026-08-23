import React, { useState, useContext } from 'react';
import { Data } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Entry() {
  const navigate = useNavigate();
  const context = useContext(Data);

  if (!context) {
    throw new Error("This component must be wrapped in AuthContext");
  }

  const { signup } = context;

  const [userdet, setuserdet] = useState({
    Name: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    PhoneNumber: "",
    AcceptTerms: false
  })

  const [error, seterror] = useState({
    Name: false,
    Email: false,
    Password: false,
    ConfirmPassword: false,
    PhoneNumber: false,
    AcceptTerms: false
  })

  // Separate from the per-field boolean errors above — this holds a
  // message for form-level problems, like "email already registered".
  const [signupError, setSignupError] = useState<string | null>(null);

  const handlechange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    // Clear errors as soon as the user starts correcting them: the form-level
    // message, plus the red flag on whichever field they're editing. Without
    // this, errors stayed on screen while the user fixed the very field they
    // referred to.
    setSignupError(null);
    seterror((perror) => ({ ...perror, [name]: false }));

    setuserdet((prevState) => ({
      ...prevState, [name]: type === "checkbox" ? checked : value
    }))
  }

  const handlesubmit = (event: React.FormEvent<HTMLFormElement>) => {
    seterror({
      Name: false,
      Email: false,
      Password: false,
      ConfirmPassword: false,
      PhoneNumber: false,
      AcceptTerms: false
    })
    setSignupError(null);
    event.preventDefault();
    let errorflag = false;
    if (userdet.Name.trim().length === 0) {
      seterror((perror) => { return { ...perror, Name: true } });
      errorflag = true;
    }
    if (userdet.Email.trim().length === 0) {
      seterror((perror) => { return { ...perror, Email: true } });
      errorflag = true;
    }
    if (userdet.Password.trim().length === 0) {
      seterror((perror) => { return { ...perror, Password: true } });
      errorflag = true;
    }
    if (userdet.ConfirmPassword.trim().length === 0) {
      seterror((perror) => { return { ...perror, ConfirmPassword: true } });
      errorflag = true;
    } else if (userdet.ConfirmPassword !== userdet.Password) {
      setSignupError("Passwords do not match");
      errorflag = true;
    }
    if (userdet.PhoneNumber.trim().length === 0) {
      seterror((perror) => { return { ...perror, PhoneNumber: true } });
      errorflag = true;
    }
    if (userdet.AcceptTerms === false) {
      seterror((perror) => { return { ...perror, AcceptTerms: true } });
      errorflag = true;
    }
    if (errorflag === false) {
      const result = signup({
        name: userdet.Name,
        email: userdet.Email,
        password: userdet.Password
      });

      if (!result.success) {
        setSignupError(result.message ?? "Could not create account");
        return;
      }

      setuserdet({
        Name: "",
        Email: "",
        Password: "",
        ConfirmPassword: "",
        PhoneNumber: "",
        AcceptTerms: false
      })
      navigate('/movielistboard');
    }
    else {
      return
    }
  }

  // preventDefault was missing here, so the <a href="/login"> fired alongside
  // navigate() — a full page reload on top of the client-side route change.
  const handleclick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate('/login');
  }

  return (
    <div className="login-page">
      <section className="login-hero">
        <p>Discover new things on Superapp</p>
      </section>

      <form className="login-card" onSubmit={handlesubmit}>
        <h1>Super app</h1>
        <p className="login-subtitle">Create your new account</p>

        {signupError && <p className="field-error">{signupError}</p>}

        <input type="text" name="Name" placeholder="Name" value={userdet.Name} onChange={handlechange} />
        {error.Name && <p className="field-error">Name is required</p>}

        <input type="text" name="Email" placeholder="Email" value={userdet.Email} onChange={handlechange} />
        {error.Email && <p className="field-error">Email is required</p>}

        <input type="password" name="Password" placeholder="Password" value={userdet.Password} onChange={handlechange} />
        {error.Password && <p className="field-error">Password is required</p>}

        <input
          type="password"
          name="ConfirmPassword"
          placeholder="Confirm Password"
          value={userdet.ConfirmPassword}
          onChange={handlechange}
        />
        {error.ConfirmPassword && <p className="field-error">Confirm password is required</p>}

        <input
          type="text"
          name="PhoneNumber"
          placeholder="Phone Number"
          value={userdet.PhoneNumber}
          onChange={handlechange}
        />
        {error.PhoneNumber && <p className="field-error">Phone number is required</p>}

        <label className="terms-row" htmlFor="tnc">
          <input type="checkbox" name="AcceptTerms" id="tnc" checked={userdet.AcceptTerms} onChange={handlechange} />
          Share my registration data with Superapp
        </label>
        {error.AcceptTerms && <p className="field-error">You must accept the terms and conditions</p>}

        <button type="submit">SIGN UP</button>

        <label>Already have an account? <a href='/login' onClick={handleclick}>Login here</a></label>
      </form>
    </div>
  )
}