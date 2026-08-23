import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Data } from "../context/AuthContext";
import { GENRES } from "../constants/genres";
import "../styles/Moviewidget.css";
import "../styles/Logout.css";

type ApiMovie = { posterURL?: string };

const Moviewidget = () => {
  const navigate = useNavigate();
  const context = useContext(Data);

  if (!context) {
    throw new Error("This component must be wrapped in AuthContext");
  }

  const { selectedMovies } = context;

  const [moviesByGenre, setMoviesByGenre] = useState<
    Record<string, string[]>
  >({});
  const [failedGenres, setFailedGenres] = useState<string[]>([]);

  // Starts true: on the very first render the effect hasn't run yet, so
  // without this there'd be one frame of an empty grid before the spinner.
  const [loading, setLoading] = useState(true);

  // A primitive dependency. `selectedMovies` is an array, so if it were the
  // dep directly, any new array with identical contents would retrigger the
  // fetch. Joining to a string means the effect only reruns when the actual
  // list of genres changes.
  const genreKey = selectedMovies.join(",");

  useEffect(() => {
    // Anything not in GENRES was saved before the list was trimmed, or is
    // otherwise unfetchable — drop it rather than requesting /movies/undefined.
    const genres = genreKey
      ? genreKey.split(",").filter((g) => g in GENRES)
      : [];

    // Bail without touching state. This branch used to call setMoviesByGenre
    // and setFailedGenres, which forced a second render pass after paint.
    // The empty case is handled during render instead (see visibleGenres).
    if (genres.length === 0) return;

    let cancelled = false;

    async function showMovieaccToGenre() {
      setLoading(true);
      const tempData: Record<string, string[]> = {};
      const failed: string[] = [];

      for (const genre of genres) {
        try {
          const response = await fetch(
            `https://api.sampleapis.com/movies/${GENRES[genre]}`
          );

          if (!response.ok) {
            failed.push(genre);
            continue;
          }

          const data = await response.json();

          if (!Array.isArray(data)) {
            failed.push(genre);
            continue;
          }

          // new Set removes repeats within a genre — the API's own list has
          // the odd duplicate title. Slicing AFTER dedupe means we still get
          // a full 8 rather than 8-minus-duplicates.
          const posters = [
            ...new Set(
              data
                .filter((movie: ApiMovie) => movie.posterURL)
                .map((movie: ApiMovie) => movie.posterURL as string)
            ),
          ].slice(0, 8);

          if (posters.length === 0) {
            failed.push(genre);
          } else {
            tempData[genre] = posters;
          }
        } catch {
          failed.push(genre);
        }
      }

      // The genre list may have changed, or the component unmounted, while
      // those requests were in flight. Writing here would show stale posters.
      if (!cancelled) {
        setMoviesByGenre(tempData);
        setFailedGenres(failed);
        setLoading(false);
      }
    }

    showMovieaccToGenre();

    return () => {
      cancelled = true;
    };
  }, [genreKey]);

  // Derived during render, not stored in state.
  //
  // moviesByGenre only updates when the fetch finishes, so it lags behind
  // selectedMovies. Rendering from it directly means a genre the user just
  // deselected stays on screen until the network calls complete. Filtering
  // through selectedMovies — which the context updates synchronously — means
  // the stale entries never reach the screen. The stale data still sits in
  // state; it just can't be displayed.
  //
  // Same reasoning as dropping the old `userdet` key: don't render from two
  // sources that can disagree. Pick the one that's always current.
  const visibleGenres = Object.entries(moviesByGenre).filter(([genre]) =>
    selectedMovies.includes(genre)
  );

  const visibleFailures = failedGenres.filter((genre) =>
    selectedMovies.includes(genre)
  );

  // Checked before `loading` so an empty selection shows the prompt rather
  // than a spinner that would never resolve.
  if (selectedMovies.length === 0) {
    return (
      <div className="movie-widget-container">
        <p>You haven't picked any categories yet.</p>
        <button onClick={() => navigate("/movielistboard")}>
          Choose categories
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="movie-widget-container">
        <div className="widget-loader" role="status">
          <div className="spinner" aria-hidden="true" />
          <p>Loading your movies…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-widget-container">
      {visibleGenres.map(([genre, posters]) => (
        <div key={genre} className="movie-genre-section">
          <h4 className="movie-genre-title">{genre}</h4>

          <div className="movie-genre-grid">
            {posters.map((poster, index) => (
              <div key={poster} className="movie-poster-card">
                <img
                  src={poster}
                  alt={`${genre} movie ${index + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    // The URL was present in the API response but the image
                    // itself is gone. Remove the card rather than leaving an
                    // empty rectangle — the next poster slides up to fill the
                    // gap, since the CSS caps the grid at 4 visible.
                    e.currentTarget.closest(".movie-poster-card")?.remove();
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* A genre that failed to load is shown rather than silently dropped,
          so the page never looks mysteriously incomplete. */}
      {visibleFailures.length > 0 && (
        <p className="movie-genre-error">
          Couldn't load: {visibleFailures.join(", ")}. Try refreshing.
        </p>
      )}

      <button className="widget-back-button" onClick={() => navigate("/profile")}>
        Back to profile
      </button>
    </div>
  );
};

export default Moviewidget;