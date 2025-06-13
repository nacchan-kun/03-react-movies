'use client';

import toast from 'react-hot-toast';
import styles from './SearchBar.module.css';

// 1. Change prop name from 'action' to 'onSubmit'
// 2. Change the type from (formData: FormData) => void to (query: string) => void
interface SearchBarProps {
  onSubmit: (query: string) => void;
}

// Destructure onSubmit prop instead of action
export default function SearchBar({ onSubmit }: SearchBarProps) {
  // Rename handleFormAction to something more descriptive like handleFormSubmit
  // Change parameter from formData: FormData to event: React.FormEvent<HTMLFormElement>
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission as we're handling it manually

    const formData = new FormData(event.currentTarget); // Get FormData from the form element
    const searchQuery = formData.get("query") as string;

    if (!searchQuery || !searchQuery.trim()) {
      toast.error('Please enter your search query.');
      return;
    }

    // Call the onSubmit prop with the cleaned search query string
    onSubmit(searchQuery.trim());
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
        {/* Use the standard 'onSubmit' event handler for the form */}
        <form className={styles.form} onSubmit={handleFormSubmit}>
          <input
            className={styles.input}
            type="text"
            name="query" // Ensure the name attribute is 'query' to extract it from FormData
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