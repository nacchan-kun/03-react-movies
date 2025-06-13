import { useState } from "react"; // Removed useEffect as it's not strictly needed without useQuery for basic state
import toast, { Toaster } from "react-hot-toast";

import type { Movie } from "../../types/movie"; // Movie comes from types/movie
import type { MovieApiResponse } from "../../services/movieService"; // MovieApiResponse comes from movieService
import { fetchMovies } from "../../services/movieService";

// Adjust paths if your component structure is different from 'components' subfolder
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";



function App() {
  const [movies, setMovies] = useState<Movie[]>([]); // Holds the array of movies
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>(''); // To track if a search was made

  const closeModal = () => setSelectedMovie(null);

  // handleSearch now accepts a 'string' query directly from SearchBar's onSubmit
  const handleSearch = async (searchQuery: string) => {
    // SearchBar now handles the primary validation for empty/trimmed query
    if (!searchQuery || !searchQuery.trim()) {
      // This case should ideally be caught by SearchBar, but as a fallback
      toast.error("Please enter your search query.");
      return;
    }

    setLastSearchQuery(searchQuery.trim()); // Store the query for "no movies found" message
    setMovies([]); // Clear previous results immediately
    setIsLoading(true);
    setError(false);

    try {
      const responseData: MovieApiResponse = await fetchMovies(searchQuery.trim());
      const results = responseData.results;

      if (results.length === 0) {
        toast.error(`No movies found for "${searchQuery.trim()}".`);
      }
      setMovies(results); // Set the 'movies' state with the array of Movie objects
    } catch (err) {
      console.error("Error fetching movies:", err); // Log the error for debugging
      setError(true);
      toast.error("Something went wrong during the search. Please try again."); // Display toast on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      {/* CRITICAL FIX: Pass handleSearch to the 'onSubmit' prop of SearchBar */}
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {error && (
        <ErrorMessage message="Something went wrong. Please try again." />
      )}

      {/* Display "No movies found" message only if a query was made and no results came back */}
      {!isLoading && !error && movies.length === 0 && lastSearchQuery && (
        <p>No movies found for your request.</p>
      )}

      {/* Only render MovieGrid if not loading, no error, and movies array has items */}
      {!isLoading && !error && movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelect={(movie) => setSelectedMovie(movie)}
        />
        // Pagination logic is removed as react-paginate is not required
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}

export default App;