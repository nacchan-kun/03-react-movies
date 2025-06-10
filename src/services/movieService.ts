import axios from 'axios';
import type { Movie } from '../types/movie';

interface FetchMoviesResponse {
  results: Movie[];
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  if (!import.meta.env.VITE_TMDB_TOKEN) {
    throw new Error('TMDB API token is missing');
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
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,  // Add your token here
      },
    }
  );

  return response.data.results;
};