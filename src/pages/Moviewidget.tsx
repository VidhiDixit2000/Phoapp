import React, { useEffect, useState } from "react";

const Moviewidget = () => {
  const [selectedmoviesvsid, setselectedmoviesvsid] = useState<Record<string, string>>({});
  const [selectedmoviesvsposter, setselectedmoviesvsposter] = useState<Record<string, string[]>>({});
  const API_KEY = "713d092437a0d2e3c99186265d1f65c5";
 

    const selectedMovies = JSON.parse(localStorage.getItem("selectedMovies") ?? "[]");

  

  useEffect(() => {
     console.log("updated state", selectedmoviesvsid);
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
         genreMap[genrefound.name] = genrefound.id;
        }
        else{
             console.log("Genre not found");
          return;
        }
});
        setselectedmoviesvsid(genreMap);
      
console.log("selectedmoviesvsid", selectedmoviesvsid);
      Object.values(genreMap).forEach(async (id: string) => {
        const res1 = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${id}`
        );
        const data = await res1.json();

       const posters= data.results
          .filter((posteritem: any) => posteritem.poster_path != null)
          .slice(0, 4)
          .map((item: any) => item.poster_path)
            
      setselectedmoviesvsposter(prev=>({
        ...prev,
        [id]: posters
      }));
          });
    }

    showMovieaccToGenre();
  }, []);

  return (
    <div>
      {Object.entries(selectedmoviesvsposter).map(([id, poster]) => (
        <div key={id}>
          <h4 style={{ color: "grey" }}>{selectedmoviesvsid[id]}</h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "10px",
            }}
          >
            {poster.map((item, index) => (
              <div
                key={index}
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "lightblue",
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${item}`}
                  alt={`movie-${index}`}
                  width="100"
                  height="100"
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