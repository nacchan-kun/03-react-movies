'use client'; // only needed in frameworks like Next.js App Router

import toast from 'react-hot-toast';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  action: (formData: FormData) => void;
}

export default function SearchBar({ action }: SearchBarProps) {
  const handleAction = (formData: FormData) => {
    const query = formData.get('query') as string;

    if (!query || !query.trim()) {
      toast.error('Please enter your search query.');
      return;
    }

    action (new FormData().set('query', query.trim()));
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form className={styles.form} action={handleAction}>
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}