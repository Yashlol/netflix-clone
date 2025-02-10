import { TMDB_API_KEY } from '@env';
import { API_CONFIG } from '../constants/api';

const BASE_URL = API_CONFIG.TMDB.BASE_URL;
const API_KEY = TMDB_API_KEY;

export type Movie = {
  id: number;
  title: string;
  name?: string; // For TV shows
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string; // For TV shows
  vote_average: number;
  genre_ids: number[];
  media_type?: string;
};

export const movieService = {
  async getTrending(): Promise<Movie[]> {
    const response = await fetch(
      `${BASE_URL}/trending/all/week?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
  },

  async getMovieDetails(id: number): Promise<Movie> {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,similar`
    );
    const data = await response.json();
    return data;
  },

  async getSimilarMovies(id: number): Promise<Movie[]> {
    const response = await fetch(
      `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
  },

  async searchMovies(query: string): Promise<Movie[]> {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.results;
  },

  getImageUrl(path: string, size: string = 'original'): string {
    return `${API_CONFIG.TMDB.IMAGE_BASE_URL}/${size}${path}`;
  },

  async getMovieTrailer(id: number): Promise<string | null> {
    const response = await fetch(
      `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`
    );
    const data = await response.json();
    const trailer = data.results.find(
      (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer ? trailer.key : null;
  },
}; 