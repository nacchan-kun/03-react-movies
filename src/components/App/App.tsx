import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../../components/SearchBar/SearchBar.module.css";
import MovieGrid from "../../components/MovieGrid/MovieGrid.module.css";
import MovieModal from "../../components/MovieModal/MovieModal.module.css";
import Loader from "../../components/Loader/Loader.module.css";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const closeModal: () => void = () => {
    setSelectedMovie(null);
  };

  const handleSearch: (query: string) => Promise<void> = async (query) => {
    if (!query.trim()) {
      toast.error("Please enter your search query.");
      return;
    }
    try {
      setIsLoading(true);
      setError(false);
      setMovies([]);

      const results = await fetchMovies({query});

      if (results.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }

      setMovies(results);
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      {!isLoading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}

export default App;