import { createPortal } from 'react-dom';
import { FC, useEffect } from 'react';
import { MovieDetails } from '../types';
import styles from './MovieModal.module.css';

interface MovieModalProps {
  movie: MovieDetails;
  onClose: () => void;
}

const modalRoot = document.getElementById('modal-root')!;

const MovieModal: FC<MovieModalProps> = ({ movie, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.close}>×</button>
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : '/no-poster.png'}
          alt={movie.Title}
          className={styles.poster}
        />
        <div className={styles.details}>
          <h2>{movie.Title} ({movie.Year})</h2>
          <p><strong>Genre:</strong> {movie.Genre}</p>
          <p><strong>Plot:</strong> {movie.Plot}</p>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Actors:</strong> {movie.Actors}</p>
          <p><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default MovieModal;