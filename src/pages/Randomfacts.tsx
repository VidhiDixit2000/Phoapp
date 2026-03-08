import React,{useEffect, useState} from 'react'
import '../styles/Randomfacts.css';
const Randomfacts = () => {
    const [fact, setFact] = useState<string>();
    const [image, setImage] = useState<string>();
    const[url, setUrl] = useState<string>();
async function getrandomfact(){
    const res = await fetch(
  "https://en.wikipedia.org/api/rest_v1/page/random/summary"
);
//console.log("res",JSON.parse(res));
const data = await res.json();

setFact(data.extract);
setImage(data.thumbnail?.source);
setUrl(data.content_urls?.desktop?.page);
}

useEffect(() => {
  getrandomfact();
}, []);
  return (
    <div className="randomfacts-image-widget">
    <div className="randomfacts-image-wrap">
      {image && <img src={image} alt="Random Fact" width="30%" />}
      
    </div>
    <div className="randomfacts-text">
        {fact}
    </div>
    <a href={url} target="_blank" rel="noopener noreferrer" className="randomfacts-link">
  <button>Browse</button>
</a>

    </div>
  );
};

export default Randomfacts
