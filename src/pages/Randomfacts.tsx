import React,{useEffect, useState} from 'react'

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
    <div>
    <div>
      {image && <img src={image} alt="Random Fact" width="30%" />}
      
    </div>
    <div>
        {fact}
    </div>
    <a href={url} target="_blank" rel="noopener noreferrer">
  <button>Browse</button>
</a>

    </div>
  )
}

export default Randomfacts
