import { useState, useEffect } from "react"; // Add useEffect back for consistency and potential future use (e.g., error toasts)
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import type { MovieApiResponse } from "../../services/movieService"; // Import MovieApiResponse
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar"; // Corrected relative path as per previous context
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>(''); // Keep track of the current successful query for "no movies found" message clarity

  const closeModal = () => setSelectedMovie(null);

  // Use useEffect to manage error toasts, as it's a good practice for side effects
  useEffect(() => {
    if (error) {
      toast.error("Something went wrong during the search. Please try again.");
    }
  }, [error]);

  // This handles the search query string from SearchBar's onSubmit
  // It now accepts a string, not FormData
  const handleSearch = async (query: string) => {
    // The query validation (empty/trim) is now handled inside SearchBar.tsx
    // So, we can directly proceed with fetching if we receive a query here.
    if (!query) {
      // This case should ideally be caught by SearchBar, but as a fallback
      return;
    }

    setCurrentQuery(query); // Store the current query for conditional messages

    try {
      setIsLoading(true);
      setError(false);
      setMovies([]); // Clear previous results

      // fetchMovies returns a Promise<MovieApiResponse>
      const responseData: MovieApiResponse = await fetchMovies(query); // Pass the query string directly

      const results = responseData.results;

      if (results.length === 0) {
        toast.error(`No movies found for "${query}".`); // More specific toast message
        // No need to return here, just set empty movies
      }

      setMovies(results); // Set the 'movies' state with the array of Movie objects
    } catch (err) {
      console.error("Error fetching movies:", err); // Log the error for debugging
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      {/* Pass handleSearch to the 'onSubmit' prop of SearchBar */}
      <SearchBar onSubmit={handleSearch} />

      {/* Conditional rendering based on state */}
      {isLoading && <Loader />}
      {error && <ErrorMessage message="Something went wrong. Please try again." />}

      {/* Display "No movies found" message only if a query was made and no results came back */}
      {!isLoading && !error && movies.length === 0 && currentQuery && (
        <p>No movies found for your request.</p>
      )}

      {/* Only render MovieGrid if not loading, no error, and movies array has items */}
      {!isLoading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {/* Render MovieModal if a movie is selected */}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
    </>
  );
}

export default App;