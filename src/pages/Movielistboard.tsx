import { useState,useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/Movielistboard.css';
export default function App() {
const navigate = useNavigate();

  const movies = [{id:1, title:"Action"},{id:2, title:"Comedy"},{id:3, title:"Drama"},{id:4, title:"thriller"},{id:5, title:"Romance"},{id:6, title:"Sci-fi"},{id:7, title:"Horror"},{id:8, title:"Documentary"},{id:9, title:"Animation"}];
const savedSelectedMovies = JSON.parse(localStorage.getItem("selectedMovies") ?? "[]");
console.log("savedSelectedMovies", savedSelectedMovies);
  const [selectedMovie, setSelectedMovie] = useState<string[]>(savedSelectedMovies);
  function handleclick(title:string){
//if not present add it, else remove it
if(selectedMovie.includes(title)){
 setSelectedMovie(selectedMovie.filter(movieTitle=>movieTitle!==title)); 
  }else{
    setSelectedMovie([...selectedMovie,title]);
  }
 
}
 useEffect(() => {
     localStorage.setItem('selectedMovies', JSON.stringify([...selectedMovie]));
   }, [selectedMovie]);
 console.log("selectedMovie", selectedMovie);
 
function checkforerror(){
if(selectedMovie.length<3){
  alert("Please select at least 3 movies");
}
else{
  navigate('/profile');
}
}
  return (
    <div className="movie-board-page">
      <section className="board-left-pane">
        <h1>Super app</h1>
        <p>
          Choose your entertainment category so we can tailor a profile dashboard designed around your taste.
        </p>
          <div className="selection-strip">
          {selectedMovie.map((movieTitle) => (
            <div className="selected-chip">
            
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
          {movies.map((movie) => (
            <button
              type="button"
              key={movie.id}
              onClick={() => handleclick(movie.title)}
              className={`genre-pill ${selectedMovie.includes(movie.title) ? 'active' : ''}`}
            >
              {movie.title}
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