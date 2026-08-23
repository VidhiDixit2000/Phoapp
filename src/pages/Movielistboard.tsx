import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Data } from '../context/AuthContext';
import { GENRES, GENRE_LABELS } from '../constants/genres';
import '../styles/Movielistboard.css';

export default function Movielistboard() {
  const navigate = useNavigate();
  const context = useContext(Data);

  if (!context) {
    throw new Error("This component must be wrapped in AuthContext");
  }

  const { selectedMovies, saveSelectedMovies } = context;

  // The pills are driven by the genres file, so a user can only ever pick
  // something the API actually serves. Previously this was a hardcoded list
  // that had drifted out of sync with the endpoints.
  function handleclick(title: string) {
    // if not present add it, else remove it
    if (selectedMovies.includes(title)) {
      saveSelectedMovies(selectedMovies.filter(movieTitle => movieTitle !== title));
    } else {
      saveSelectedMovies([...selectedMovies, title]);
    }
  }

  function checkforerror() {
    if (selectedMovies.length < 3) {
      alert("Please select at least 3 movies");
    }
    else {
      navigate('/profile');
    }
  }

  // Guards against genres saved before the list was trimmed (e.g. "Sci-fi"
  // from an older session) showing up as chips that no longer exist.
  const validSelections = selectedMovies.filter((title) => title in GENRES);

  return (
    <div className="movie-board-page">
      <section className="board-left-pane">
        <h1>Super app</h1>
        <p>
          Choose your entertainment category so we can tailor a profile dashboard designed around your taste.
        </p>
        <div className="selection-strip">
          {validSelections.map((movieTitle) => (
            <div className="selected-chip" key={movieTitle}>
              {movieTitle}
              <span onClick={() => handleclick(movieTitle)}>X</span>
            </div>
          ))}
        </div>
      </section>

      <section className="movie-board-card">
        <h2>Choose your entertainment category</h2>
        <p className="board-subtitle">Minimum 3 categories required</p>

        <div className="genre-grid">
          {GENRE_LABELS.map((label) => (
            <button
              type="button"
              key={label}
              onClick={() => handleclick(label)}
              className={`genre-pill ${selectedMovies.includes(label) ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        <button className="next-button" onClick={checkforerror}>
          Next Page
        </button>
      </section>
    </div>
  )
}