import { useState,useEffect} from "react";
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h1>Home Page</h1>
      <div>
        {movies.map(movie=><div onClick={()=>handleclick(movie.title)}>{movie.title}</div>)}
      </div>
      <div>
        {selectedMovie.map(movieTitle=><div>{movieTitle}</div>)}
    </div>
    <div>
      <button onClick={checkforerror}> next page</button>
    </div>
    </div>
  )
}