'use client';

import toast from 'react-hot-toast';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  action: (formData: FormData) => void;
}

export default function SearchBar({ action }: SearchBarProps) {
  const handleFormAction = (formData: FormData) => {
    const searchQuery = formData.get("query") as string;
    if (!searchQuery || !searchQuery.trim()) {
      toast.error('Please enter your search query.');
      return;
    }

    action(formData);
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
        {/* Use the 'action' prop on the form and pass the internal handler */}
        <form className={styles.form} action={handleFormAction}>
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