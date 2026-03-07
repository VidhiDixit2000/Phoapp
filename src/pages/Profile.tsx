import React from 'react'
import Timerpage  from './Timerpage';
import Weather from './Weather';  
import Randomfacts from './Randomfacts'; 
import { useNavigate } from 'react-router-dom';
const Profile = () => {
  const navigate = useNavigate();
  type parsedDetailsType = {
  name: string;
  email: string;
  password: string;
};

  const UserDetails =localStorage.getItem("userdet");
  const parsedDetails: parsedDetailsType | null = UserDetails ? JSON.parse(UserDetails) : null;
  const selectedMovies = JSON.parse(localStorage.getItem("selectedMovies") ?? "[]");
  return (
    <>
      {parsedDetails && (
        <>
          <div>
            <p>Name: {parsedDetails.name}</p>
            <p>Email: {parsedDetails.email}</p>
          </div>

          <div>
            <h2>Selected Movies</h2>
            {selectedMovies.map((movieTitle:string) => (
              <div >{movieTitle}</div>
            ))}
            <div>
               <Timerpage></Timerpage>
               <Weather></Weather>
               <Randomfacts></Randomfacts>
            </div>
            <div><button onClick={()=>navigate("/moviewidget")}>View Selected Movies</button></div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;