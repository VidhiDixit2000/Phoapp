import { useEffect, useState } from 'react';
import '../styles/Randomfacts.css';

type FactState = {
  title?: string;
  fact?: string;
  image?: string;
  url?: string;
};

const Randomfacts = () => {
  // One object instead of four separate useState calls. These always arrive
  // together from the same response, so splitting them gave four ways for the
  // widget to be half-populated and no way to tell "not loaded yet" from
  // "loaded but this field was missing".
  const [data, setData] = useState<FactState | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Defined INSIDE the effect. Previously it lived in the component body,
    // so a new copy was created on every render while the effect captured
    // the first one — and the lint rule flagged the call as setState in an
    // effect. Declaring it here scopes it to the one place it's used.
    let cancelled = false;

    async function getrandomfact() {
      try {
        const res = await fetch(
          "https://en.wikipedia.org/api/rest_v1/page/random/summary"
        );

        if (!res.ok) {
          throw new Error(`Wikipedia returned ${res.status}`);
        }

        const json = await res.json();

        // The component may have unmounted while the request was in flight.
        if (cancelled) return;

        setData({
          title: json.description,
          fact: json.extract,
          image: json.thumbnail?.source,
          url: json.content_urls?.desktop?.page,
        });
      } catch (err) {
        if (!cancelled) {
          console.error("Could not load random fact", err);
          setError(true);
        }
      }
    }

    getrandomfact();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="randomfacts-image-widget">
        <div className="randomfacts-text">Couldn't load a fact right now.</div>
      </div>
    );
  }

  return (
    <div className="randomfacts-image-widget">
      <div className="randomfacts-image-wrap">
        {data?.image && <img src={data.image} alt={data.title ?? "Random fact"} />}
        <h4 className='heading'>{data?.title}</h4>
      </div>

      <div className="randomfacts-text">
        {data?.fact}
      </div>

      {/* Only rendered once the URL exists. Before, the anchor rendered
          immediately with href="undefined", so clicking Browse during the
          initial load navigated to a broken path. */}
      {data?.url && (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="randomfacts-link"
        >
          <button>Browse</button>
        </a>
      )}
    </div>
  );
};

export default Randomfacts;