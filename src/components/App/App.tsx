import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { Movie, MovieApiResponse } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../../components/SearchBar/SearchBar";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import MovieModal from "../../components/MovieModal/MovieModal";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

function App() {
  // These states manage the UI based on the search operation
  const [movies, setMovies] = useState<Movie[]>([]); // Holds the array of movies
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const closeModal = () => setSelectedMovie(null);

  // This handles the form submission from SearchBar using React Form Actions
  const handleSearch = async (formData: FormData) => {
    const query = formData.get("query") as string;

    if (!query || !query.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    try {
      setIsLoading(true);
      setError(false);
      setMovies([]); // Clear previous results

      // fetchMovies returns a Promise<MovieApiResponse>
      const responseData: MovieApiResponse = await fetchMovies(query.trim());

      // Access the 'results' array from the MovieApiResponse
      const results = responseData.results;

      if (results.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }

      setMovies(results); // Set the 'movies' state with the array of Movie objects
    } catch (err) {
      console.error("Error fetching movies:", err); // Log the error for debugging
      setError(true);
      toast.error("Something went wrong during the search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      {/* Pass handleSearch to the 'action' prop of SearchBar */}
      <SearchBar action={handleSearch} />

      {/* Conditional rendering based on state */}
      {isLoading && <Loader />}
      {error && <ErrorMessage message="Something went wrong. Please try again." />}

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