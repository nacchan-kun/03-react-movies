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
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');

  const closeModal = () => setSelectedMovie(null);

  // handleSearch now accepts a FormData object from SearchBar's action prop,
  // as required for React Form Actions API.
  const handleSearch = async (formData: FormData) => {
    const searchQuery = formData.get("query") as string;

    if (!searchQuery || !searchQuery.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    setLastSearchQuery(searchQuery.trim());
    setMovies([]);
    setIsLoading(true);
    setError(false);

    try {
      const responseData: MovieApiResponse = await fetchMovies(searchQuery.trim());
      const results = responseData.results;

      if (results.length === 0) {
        toast.error(`No movies found for "${searchQuery.trim()}".`);
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

      {/* Pass handleSearch to the 'action' prop of SearchBar for React Form Actions */}
      <SearchBar action={handleSearch} />

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