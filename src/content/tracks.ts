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
    artist: "Odeal",
    title: "Rush",
    spotifyUrl: "https://open.spotify.com/track/7i8pBcK7oEv5EKrCkAq0pu?si=6ea19fe2463a49bf",
  },
  {
    artist: "Lee Moses",
    title: "California Dreaming",
    spotifyUrl: "https://open.spotify.com/track/08F9nSB54hlgsPfTYDOL44?si=ffe46450a4904f68",
  },
  {
    artist: "Pangeaux",
    title: "Holdin' On",
    spotifyUrl: "https://open.spotify.com/track/6MaIMR1Dearuvq60zy6MTa?si=8e7b19e3fef243c9",
  },
  {
    artist: "Jack Harlow",
    title: "Knack For It",
    spotifyUrl: "https://open.spotify.com/track/7znMNt4SWNyheMtwgzvUzK?si=043967fd5bdb439a"
  },
  {
    artist: "Kendrick Lamar",
    title: "Good Flirts",
    spotifyUrl: "https://open.spotify.com/track/5sHeIGDbdzw8DeO57XZKIy?si=9c8a1d1e861043c8"
  },
  {
    artist: "Ragz Originale & Bakar",
    title: "Long Stay",
    spotifyUrl: "https://open.spotify.com/track/5ie2bMXcmiwk6q8TrP8J1W?si=fb29afd741a349d8"
  },
  {
    artist: "Phil Collins",
    title: "Another Day in Paradise",
    spotifyUrl: "https://open.spotify.com/track/1NCuYqMc8hKMb4cpNTcJbD?si=3cd5c9e9ac54489c"
  },
  {
    artist: "J Cole",
    title: "January 28th",
    spotifyUrl: "https://open.spotify.com/track/6LBpGdlukUARutol7VgWIS?si=48e6e568c22c4939"
  },
  {
    artist: "Ezra Collective",
    title: "God Gave Me Feet For Dancing",
    spotifyUrl: "https://open.spotify.com/track/0g6k1Z7r5x8J3v9z5Q2FqE?si=1e4f8c9e2b4a4f3d"
  },
  {
    artist: "KAYTRANADA",
    title: "You're The One",
    spotifyUrl: "https://open.spotify.com/track/70kdJnm1X6eEM8DbWa8Mnc?si=144e9fa2e3cc4fcd"
  },
  {
    artist: "Brent Faiyaz",
    title: "Bad Luck",
    spotifyUrl: "https://open.spotify.com/track/5YbHnEYZFkOxLsp5syLMLy?si=ab36763d72244f75"
  },
  {
    artist: "Bryson Tiller & Drake",
    title: "Outta Time",
    spotifyUrl: "https://open.spotify.com/track/4SCnCPOUOUXUmCX2uHb3r7?si=e1bfc1cf141e4753"
  }
];
