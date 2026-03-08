import React,{useState,useContext} from 'react';
import { Data } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
export default function App() {
  const navigate = useNavigate();
const context = useContext(Data);

if (!context) {
  throw new Error("This component must be wrapped in AuthContext");
}

const { signup } = context;

  const [userdet,setuserdet]=useState(
    {
      Name:"",
      Email:"",
      Password:"",
      ConfirmPassword:"",
      PhoneNumber:"",
      AcceptTerms:false
    })

    const [error,seterror]=useState(
      {
      Name:false,
      Email:false,
      Password:false,
      ConfirmPassword:false,
      PhoneNumber:false,
      AcceptTerms:false
    })
    const handlechange= (event: React.ChangeEvent<HTMLInputElement>) =>{
      const {name,value,type,checked}=event.target;
      setuserdet((prevState)=>({
        ...prevState,[name]:type==="checkbox"?checked:value
      }))
    }

    const handlesubmit = (event: React.FormEvent<HTMLFormElement>)=>{
      seterror({ 
      Name:false,
      Email:false,
      Password:false,
      ConfirmPassword:false,
      PhoneNumber:false,
      AcceptTerms:false
    })
      event.preventDefault();
      console.log(userdet);
      let errorflag=false;
      if(userdet.Name.trim().length===0){
        seterror((perror)=>{return{...perror,Name:true}});
        errorflag=true;
      }
       if(userdet.Email.trim().length===0){
        seterror((perror)=>{return{...perror,Email:true}});
         errorflag=true;
      }
       if(userdet.Password.trim().length===0){
        seterror((perror)=>{return{...perror,Password:true}});
         errorflag=true;
      }
       if(userdet.ConfirmPassword.trim().length===0){
        seterror((perror)=>{return{...perror,ConfirmPassword:true}});
         errorflag=true;
      }
       if(userdet.PhoneNumber.trim().length===0){
        seterror((perror)=>{return{...perror,PhoneNumber:true}});
        console.log('error.phoneno.',error.PhoneNumber);
         errorflag=true;
      }
       if(userdet.AcceptTerms===false){
        seterror((perror)=>{return{...perror,AcceptTerms:true}});
        console.log('error.acceptterms',error.AcceptTerms);
         errorflag=true;
      }
      if(errorflag===false){ 
        alert("Form Submitted Successfully");

        signup({
          name:userdet.Name,
          email:userdet.Email,
          password:userdet.Password
        });

        setuserdet(
    {
      Name:"",
      Email:"",
      Password:"",
      ConfirmPassword:"",
      PhoneNumber:"",
      AcceptTerms:false
    })
    navigate('/Movielistboard');
      }
      else{
        console.log("Form has errors");
        return
      }
      console.log('error',error);
    }
  return (
  <div className="login-page">
      <section className="login-hero">
        <p>Discover new things on Superapp</p>
      </section>

      <form className="login-card" onSubmit={handlesubmit}>
        <h1>Super app</h1>
        <p className="login-subtitle">Create your new account</p>

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
      </form>
    </div>
  )
}