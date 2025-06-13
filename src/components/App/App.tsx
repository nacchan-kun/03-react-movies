import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import type { Movie } from "../../types/movie";
import type { MovieApiResponse } from "../../services/movieService";
import { fetchMovies } from "../../services/movieService";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>("");

  const closeModal = () => setSelectedMovie(null);

  const handleSearch = async (query: string) => {
    if (!query || !query.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    const trimmedQuery = query.trim();
    setLastSearchQuery(trimmedQuery);
    setMovies([]);
    setIsLoading(true);
    setError(false);

    try {
      const responseData: MovieApiResponse = await fetchMovies(trimmedQuery);
      const results = responseData.results;

      if (results.length === 0) {
        toast.error(`No movies found for "${trimmedQuery}".`);
      }

      setMovies(results);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError(true);
      toast.error("Something went wrong during the search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />

      {/* Pass handleSearch to the onSubmit prop of SearchBar */}
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {error && (
        <ErrorMessage message="Something went wrong. Please try again." />
      )}

      {!isLoading && !error && movies.length === 0 && lastSearchQuery && (
        <p>No movies found for your request.</p>
      )}

      {!isLoading && !error && movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelect={(movie) => setSelectedMovie(movie)}
        />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}

export default App;