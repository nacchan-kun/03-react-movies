import { useEffect, useState } from 'react';
import { SearchBar } from './components/SearchBar/SearchBar';
import { MovieGrid } from './components/MovieGrid/MovieGrid';
import { Loader } from './components/Loader/Loader';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { MovieModal } from './components/MovieModal/MovieModal';
import { Movie } from './types';
import { fetchMovies, fetchMovieDetails } from './services/movieService';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  async function handleSearch(term: string) {
    setQuery(term);
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchMovies(term);
      setMovies(data);
    } catch (err) {
      setError('Failed to fetch movies.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSelectMovie(id: number) {
    setIsLoading(true);
    try {
      const movie = await fetchMovieDetails(id);
      setSelectedMovie(movie);
    } catch (err) {
      setError('Failed to fetch movie details.');
    } finally {
      setIsLoading(false);
    }
  }

  function closeModal() {
    setSelectedMovie(null);
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && !error && (
        <MovieGrid movies={movies} onSelectMovie={handleSelectMovie} />
      )}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
    </div>
  );
}
