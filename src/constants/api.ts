export const API_CONFIG = {
  TMDB: {
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    ENDPOINTS: {
      TRENDING: '/trending/all/week',
      MOVIES: '/discover/movie',
      TV_SHOWS: '/discover/tv',
      SEARCH: '/search/multi',
      MOVIE_DETAILS: '/movie',
      TV_DETAILS: '/tv'
    },
    POSTER_SIZES: {
      SMALL: 'w185',
      MEDIUM: 'w342',
      LARGE: 'w500',
      ORIGINAL: 'original'
    },
    BACKDROP_SIZES: {
      SMALL: 'w300',
      MEDIUM: 'w780',
      LARGE: 'w1280',
      ORIGINAL: 'original'
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