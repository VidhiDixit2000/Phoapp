import React, { useEffect, useState } from "react";
import '../styles/Moviewidget.css';
const Moviewidget = () => {
  const [selectedidvsmovies, setselectedidvsmovies] = useState<Record<string, string>>({});
  const [selectedidvsposter, setselectedidvsposter] = useState<Record<string, string[]>>({});
  const API_KEY = "713d092437a0d2e3c99186265d1f65c5";
 

    const selectedMovies = JSON.parse(localStorage.getItem("selectedMovies") ?? "[]");

  

  useEffect(() => {
     console.log("updated state", selectedidvsmovies);
    async function showMovieaccToGenre() {
      const res2 = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
      );
      const genreData = await res2.json();
     console.log("genreData", genreData);

     const genreMap: Record<string,string> = {};
      selectedMovies.forEach((genre: string) => {
        const genrefound = genreData.genres.find((item: any) => item.name === genre);
            console.log("genrefound", genrefound);

        if (genrefound) {
         genreMap[genrefound.id] = genrefound.name;
        }
        else{
             console.log("Genre not found");
          return;
        }
});
        setselectedidvsmovies(genreMap);
      
console.log("selectedidvsmovies", selectedidvsmovies);
      Object.keys(genreMap).forEach(async (id:string) => {
        const res1 = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${id}`
        );
        const data = await res1.json();

       const posters= data.results
          .filter((posteritem: any) => posteritem.poster_path != null)
          .slice(0, 4)
          .map((item: any) => item.poster_path)
            
      setselectedidvsposter(prev=>({
        ...prev,
        [id]: posters
      }));
          });
    }

    showMovieaccToGenre();
  }, []);

 return (
  <div className="movie-widget-container">
    {Object.entries(selectedidvsposter).map(([id, poster]) => (
      <div key={id} className="movie-genre-section">
        <h4 className="movie-genre-title">
          {selectedidvsmovies[id]}
        </h4>
        <div className="movie-genre-grid">
          {poster.map((item, index) => (
            <div key={index} className="movie-poster-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${item}`}
                alt={`movie-${index}`}
              />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

};

export default Moviewidget;