// Display label -> sampleapis endpoint slug.
//
// Verified empirically against api.sampleapis.com: every slug below returns
// 200 with 100% poster coverage. Genres the API does NOT serve (sci-fi,
// thriller, romance, documentary, war) are deliberately absent — offering a
// pill the API can't fulfil is what produced blank result pages before.
//
// Hardcoded on purpose. The API exposes no genre-list endpoint (GET /movies/
// returns 404), and deriving the UI from a third-party response is what broke
// the earlier TMDB integration. One file to edit if the endpoints ever change.

export const GENRES: Record<string, string> = {
  "Action & Adventure": "action-adventure",
  Animation: "animation",
  Classic: "classic",
  Comedy: "comedy",
  Drama: "drama",
  Family: "family",
  Horror: "horror",
  Mystery: "mystery",
  Western: "western",
};

export const GENRE_LABELS = Object.keys(GENRES);