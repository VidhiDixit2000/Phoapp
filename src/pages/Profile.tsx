import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Data } from '../context/AuthContext';
import Timerpage from './Timerpage';
import Weather from './Weather';
import Randomfacts from './Randomfacts';
import Notes from './Notes';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const context = useContext(Data);

  if (!context) {
    throw new Error("This component must be wrapped in AuthContext");
  }

  const { currentUser, selectedMovies } = context;

  // No logged-in user (e.g. direct URL hit before PrivateRoute is wired in)
  if (!currentUser) {
    return (
      <div className="profile-page">
        <p>You need to log in to view this page.</p>
        <button onClick={() => navigate('/login')}>Go to login</button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <section className="profile-grid">

        <div className="profile-user-card">
          <p>{currentUser.name}</p>
          <p>{currentUser.email}</p>

          <div className="selected-movies-list">
            {selectedMovies.length === 0 ? (
              <p className="movies-empty">No movies selected yet.</p>
            ) : (
              selectedMovies.map((movieTitle: string) => (
                <div key={movieTitle} className="movie-chip">
                  {movieTitle}
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            className="genre-cta-button"
            onClick={() => navigate('/movielistboard')}
          >
            Wanna select more genres?
          </button>
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
          <button onClick={() => navigate('/moviewidget')}>
            View selected movies
          </button>
        </div>

      </section>
    </div>
  );
};

export default Profile;