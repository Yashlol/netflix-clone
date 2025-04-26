import { TMDB_API_KEY } from '@env';
import { API_CONFIG } from '../constants/api';
import { Movie } from '../types/supabase';
import * as Network from 'expo-network';

const BASE_URL = API_CONFIG.TMDB.BASE_URL;
const IMAGE_BASE_URL = API_CONFIG.TMDB.IMAGE_BASE_URL;

const handleApiError = async (error: any, customMessage: string) => {
  console.error(`${customMessage}:`, error);

  const networkState = await Network.getNetworkStateAsync();
  if (!networkState.isConnected) {
    throw new Error('No internet connection. Please check your network and try again.');
  }

  if (error.response) {
    throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
  }

  throw new Error(customMessage);
};

export const movieService = {
  async getMovieDetails(movieId: number): Promise<Movie> {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        id: data.id,
        title: data.title,
        overview: data.overview,
        poster_path: data.poster_path
          ? `${IMAGE_BASE_URL}/${API_CONFIG.TMDB.IMAGE_SIZES.POSTER}${data.poster_path}`
          : null,
        backdrop_path: data.backdrop_path
          ? `${IMAGE_BASE_URL}/${API_CONFIG.TMDB.IMAGE_SIZES.BACKDROP}${data.backdrop_path}`
          : null,
        release_date: data.release_date,
        vote_average: data.vote_average,
        genre_ids: data.genres.map((genre: any) => genre.id),
      };
    } catch (error) {
      await handleApiError(error, 'Failed to fetch movie details');
      throw error; // rethrow to handle where you call this function
    }
  },

  async getSimilarMovies(movieId: number): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path
          ? `${IMAGE_BASE_URL}/${API_CONFIG.TMDB.IMAGE_SIZES.POSTER}${movie.poster_path}`
          : null,
        backdrop_path: movie.backdrop_path
          ? `${IMAGE_BASE_URL}/${API_CONFIG.TMDB.IMAGE_SIZES.BACKDROP}${movie.backdrop_path}`
          : null,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids,
      }));
    } catch (error) {
      await handleApiError(error, 'Failed to fetch similar movies');
      return [];
    }
  },

  async getTrendingMovies(): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path
          ? `${IMAGE_BASE_URL}/${API_CONFIG.TMDB.IMAGE_SIZES.POSTER}${movie.poster_path}`
          : null,
        backdrop_path: movie.backdrop_path
          ? `${IMAGE_BASE_URL}/${API_CONFIG.TMDB.IMAGE_SIZES.BACKDROP}${movie.backdrop_path}`
          : null,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids,
      }));
    } catch (error) {
      await handleApiError(error, 'Failed to fetch trending movies');
      return [];
    }
  },

  async getMovieTrailer(movieId: number): Promise<string | null> {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const video = data.results.find((v: any) => 
        v.type === 'Trailer' && v.site === 'YouTube'
      ) || data.results.find((v: any) => 
        v.type === 'Teaser' && v.site === 'YouTube'
      ) || data.results[0];

      return video ? `https://www.youtube.com/watch?v=${video.key}` : null;
    } catch (error) {
      await handleApiError(error, 'Failed to fetch movie trailer');
      return null;
    }
  },

  async getMultipleMovieDetails(movieIds: number[]): Promise<Movie[]> {
    try {
      const moviePromises = movieIds.map(async (id) => {
        try {
          const response = await fetch(
            `${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
          );

          if (!response.ok) {
            console.error(`Failed to fetch movie ${id}: HTTP ${response.status}`);
            return null;
          }

          const data = await response.json();
          return {
            id: data.id,
            title: data.title,
            overview: data.overview,
            poster_path: data.poster_path
              ? `${IMAGE_BASE_URL}/${API_CONFIG.TMDB.IMAGE_SIZES.POSTER}${data.poster_path}`
              : null,
            backdrop_path: data.backdrop_path
              ? `${IMAGE_BASE_URL}/${API_CONFIG.TMDB.IMAGE_SIZES.BACKDROP}${data.backdrop_path}`
              : null,
            release_date: data.release_date,
            vote_average: data.vote_average,
            genre_ids: data.genres.map((genre: any) => genre.id),
          };
        } catch (error) {
          console.error(`Error fetching movie ${id}:`, error);
          return null;
        }
      });

      const movies = await Promise.all(moviePromises);
      return movies.filter((movie): movie is Movie => movie !== null);
    } catch (error) {
      await handleApiError(error, 'Failed to fetch multiple movies');
      return [];
    }
  },
};
