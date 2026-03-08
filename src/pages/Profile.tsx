import React from 'react'
import Timerpage  from './Timerpage';
import Weather from './Weather';  
import Randomfacts from './Randomfacts'; 
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
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
        <section className="profile-grid">
          <div className="profile-user-card">
            <p>{parsedDetails.name}</p>
            <p>{parsedDetails.email}</p>
            <div className="selected-movies-list">

            {selectedMovies.map((movieTitle:string) => (
              <div className="movie-chip">{movieTitle}</div>
            ))}
            </div>
          </div>

          
        </section>
        
          
              <section className="profile-timer-card"> <Timerpage></Timerpage></section>
               
               <section className="profile-weather-card"><Weather ></Weather></section>
              <section className="profile-randomfacts-card"><Randomfacts></Randomfacts></section>
         
           
            <div className="profile-cta"><button onClick={()=>navigate("/moviewidget")}>View Selected Movies</button></div>
          
        </>
      )}
    </>
  );
};

export default Profile;