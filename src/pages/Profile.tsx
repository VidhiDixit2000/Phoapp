import React from 'react'
import Timerpage  from './Timerpage';
import Weather from './Weather';  
import Randomfacts from './Randomfacts'; 
import Notes from './Notes';
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
    <div className="profile-page">
  {parsedDetails && (
    <section className="profile-grid">

      <div className="profile-user-card">
        <p>{parsedDetails.name}</p>
        <p>{parsedDetails.email}</p>

        <div className="selected-movies-list">
          {selectedMovies.map((movieTitle: string) => (
            <div key={movieTitle} className="movie-chip">
              {movieTitle}
            </div>
          ))}
        </div>
      </div>

      <div className="profile-notes-card">
        <Notes />
      </div>

      <div className="profile-weather-card">
        <Weather />
      </div>

      <div className="profile-timer-card">
        <Timerpage />
      </div>

      <div className="profile-fact-card">
        <Randomfacts />
      </div>

      <div className="profile-cta">
        <button onClick={() => navigate("/moviewidget")}>
          View Selected Movies
        </button>
      </div>

    </section>
  )}
</div>
    </>
  );
};

export default Profile;