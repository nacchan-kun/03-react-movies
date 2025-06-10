import { FC } from 'react';
import { Movie } from '../types';
import styles from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const MovieGrid: FC<MovieGridProps> = ({ movies, onSelect }) => {
  return (
    <ul className={styles.grid}>
      {movies.map(movie => (
        <li key={movie.imdbID} className={styles.card} onClick={() => onSelect(movie)}>
          <img
            src={movie.Poster !== 'N/A' ? movie.Poster : '/no-poster.png'}
            alt={movie.Title}
            className={styles.poster}
          />
          <h3>{movie.Title}</h3>
          <p>{movie.Year}</p>
        </li>
      ))}
    </ul>
  );
};

export default MovieGrid;
