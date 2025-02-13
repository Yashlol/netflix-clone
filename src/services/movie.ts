import { TMDB_API_KEY } from '@env';
import { API_CONFIG } from '../constants/api';
import { Movie } from '../types/supabase';

const BASE_URL = API_CONFIG.TMDB.BASE_URL;
const IMAGE_BASE_URL = API_CONFIG.TMDB.IMAGE_BASE_URL;

export const movieService = {
  async getMovieDetails(movieId: number): Promise<Movie> {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }

    const data = await response.json();
    return {
      id: data.id,
      title: data.title,
      overview: data.overview,
      poster_path: `${IMAGE_BASE_URL}/${API_CONFIG.TMDB.IMAGE_SIZES.POSTER}${data.poster_path}`,
      backdrop_path: `${IMAGE_BASE_URL}/${API_CONFIG.TMDB.IMAGE_SIZES.BACKDROP}${data.backdrop_path}`,
      release_date: data.release_date,
      vote_average: data.vote_average,
      genre_ids: data.genres.map((genre: any) => genre.id),
    };
  },

  async getSimilarMovies(movieId: number): Promise<Movie[]> {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch similar movies');
    }

    const data = await response.json();
    return data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path ? `${IMAGE_BASE_URL}/${API_CONFIG.TMDB.IMAGE_SIZES.POSTER}${movie.poster_path}` : null,
      backdrop_path: movie.backdrop_path ? `${IMAGE_BASE_URL}/${API_CONFIG.TMDB.IMAGE_SIZES.BACKDROP}${movie.backdrop_path}` : null,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids,
    }));
  },

  async getTrendingMovies(): Promise<Movie[]> {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending movies');
    }

    const data = await response.json();
    return data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path ? `${IMAGE_BASE_URL}/${API_CONFIG.TMDB.IMAGE_SIZES.POSTER}${movie.poster_path}` : null,
      backdrop_path: movie.backdrop_path ? `${IMAGE_BASE_URL}/${API_CONFIG.TMDB.IMAGE_SIZES.BACKDROP}${movie.backdrop_path}` : null,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids,
    }));
  },

  async getMovieTrailer(movieId: number): Promise<string | null> {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie videos');
    }

    const data = await response.json();
    
    // Find the official trailer, teaser, or any video
    const video = data.results.find((v: any) => 
      v.type === 'Trailer' && v.site === 'YouTube'
    ) || data.results.find((v: any) => 
      v.type === 'Teaser' && v.site === 'YouTube'
    ) || data.results[0];

    return video ? `https://www.youtube.com/watch?v=${video.key}` : null;
  },
}; 