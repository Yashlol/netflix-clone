export const API_CONFIG = {
  TMDB: {
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    TMDB_API_KEY: "f3dbd6fe119fb1353c1205a778472479 ",
    ENDPOINTS: {
      TRENDING: '/trending/all/week',
      MOVIES: '/discover/movie',
      TV_SHOWS: '/discover/tv',
      SEARCH: '/search/multi',
      MOVIE_DETAILS: '/movie',
      TV_DETAILS: '/tv'
    },
    IMAGE_SIZES: {
      POSTER: 'w500',
      BACKDROP: 'original',
      PROFILE: 'w185'
    }
  },
  YOUTUBE: {
    BASE_URL: 'https://www.googleapis.com/youtube/v3',
    EMBED_BASE_URL: 'https://www.youtube.com/embed',
    ENDPOINTS: {
      SEARCH: '/search',
      VIDEOS: '/videos'
    }
  }
};

export const MAX_PROFILES = 3;

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' }
]; 