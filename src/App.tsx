import { useEffect, useState } from "react";
import { Movie } from "./types/movie";
import SearchBar from "./components/SearchBar/SearchBar";
import MovieGrid from "./components/MovieGrid/MovieGrid";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import MovieModal from "./components/MovieModal/MovieModal";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const SEARCH_URL = "https://api.themoviedb.org/3/search/movie";
const DETAILS_URL = "https://api.themoviedb.org/3/movie";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${SEARCH_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.status_message || "Something went wrong");
        if (data.results.length === 0) throw new Error("No movies found");

        const moviesData = data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          year: movie.release_date?.slice(0, 4) || "N/A",
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "",
        }));

        setMovies(moviesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  const handleSelectMovie = async (id: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${DETAILS_URL}/${id}?api_key=${API_KEY}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.status_message || "Failed to fetch movie details");

      const movieDetails: Movie = {
        id: data.id,
        title: data.title,
        year: data.release_date?.slice(0, 4) || "N/A",
        poster: data.poster_path
          ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
          : "",
        overview: data.overview,
        rating: data.vote_average,
        runtime: data.runtime,
      };

      setSelectedMovie(movieDetails);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SearchInput query={query} setQuery={setQuery} />

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && query.length >= 3 && <MovieGrid movies={movies} onSelectMovie={handleSelectMovie} />}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
