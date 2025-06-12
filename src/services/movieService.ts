import axios from 'axios';
import type { MovieApiResponse } from '../types/movie'; // <--- Import MovieApiResponse

// REMOVE this local interface. It is incomplete and conflicts with MovieApiResponse.
// interface FetchMoviesResponse {
//   results: Movie[];
// }

export const fetchMovies = async (
  query: string,
  page: number = 1 
): Promise<MovieApiResponse> => {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  if (!token) {
    throw new Error('TMDB API token is missing');
  }

  const response = await axios.get<MovieApiResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
        page, // <--- ADDED: Pass the page parameter to the API
      },
      headers: {
        Authorization: `Bearer ${token}`, // Use 'token' variable directly
      },
    }
  );

  return response.data; // <--- FIXED: Return the entire response.data (which is MovieApiResponse)
};