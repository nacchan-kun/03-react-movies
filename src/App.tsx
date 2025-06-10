import { useEffect, useState } from 'react';
import SearchBar from '../src/components/SearchBar/SearchBar.module.css';
import MovieGrid from '../src/components/MovieGrid/MovieGrid.module.css';
import Loader from '../src/components/Loader/Loader.module.css';
import ErrorMessage from '../src/components/ErrorMessage/ErrorMessage.module.css';
import MovieModal from '../src/components/MovieModal/MovieModal.module.css';
import type { Movie } from '../src/types/movie';
import { searchMovies, getMovieDetails } from '../src/services/movieService';

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError('');
    try {
      const results = await searchMovies(query);
      setMovies(results);
    } catch (err) {
      setError('Failed to fetch movies.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = async (id: number) => {
    setSelectedId(id);
    try {
      const movie = await getMovieDetails(id);
      setSelectedMovie(movie);
    } catch (err) {
      setError('Failed to load movie details.');
    }
  };

  const handleCloseModal = () => {
    setSelectedId(null);
    setSelectedMovie(null);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && !error && (
        <MovieGrid movies={movies} onSelectMovie={handleSelectMovie} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
