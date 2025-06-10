import axios from 'axios';
import type { Movie } from '../types/movie';

interface FetchMoviesResponse {
  results: Movie[];
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  if (!import.meta.env.VITE_TMDB_TOKEN) {
    throw new Error('TMDB API token is not set in environment variables.');
  }

  const response = await axios.get<FetchMoviesResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
      },
      headers: {
        // Use Bearer token from VITE_TMDB_TOKEN environment variable
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );

  return response.data.results;
};