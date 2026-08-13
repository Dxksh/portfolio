export interface Track {
  artist: string;
  title: string;
  spotifyUrl: string;
}

// PROVISIONAL — replace with your real favourite tracks. Using Spotify's
// search URL (rather than a specific track ID) so these links always work
// even before you swap them for the exact tracks/IDs you want.
export const favoriteTracks: Track[] = [
  {
    artist: "Tame Impala",
    title: "The Less I Know the Better",
    spotifyUrl: "https://open.spotify.com/search/Tame%20Impala%20The%20Less%20I%20Know%20The%20Better",
  },
  {
    artist: "Daft Punk",
    title: "One More Time",
    spotifyUrl: "https://open.spotify.com/search/Daft%20Punk%20One%20More%20Time",
  },
];
