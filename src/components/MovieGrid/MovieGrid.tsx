import type { FC } from 'react';
import type { Movie } from '../../types/movie';

interface MovieGridProps {
    movies: Movie[];
    onSelectMovie: (id: number) => void;
  }

const MovieGrid: FC<MovieGridProps> = ({ movies, onSelectMovie }) => {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div key={movie.id} onClick={() => onSelectMovie(movie.id)}>
          <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;