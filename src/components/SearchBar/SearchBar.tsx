'use client'; // This directive might be needed for React Server Components / Form Actions depending on your setup

import toast from 'react-hot-toast';
import styles from './SearchBar.module.css';

// The prop for SearchBar should now be 'action', accepting a FormData object.
interface SearchBarProps {
  action: (formData: FormData) => void;
}

export default function SearchBar({ action }: SearchBarProps) {
  // This function will be called by the form's 'action' prop.
  // It receives the FormData object directly.
  const handleFormAction = (formData: FormData) => {
    const searchQuery = formData.get("query") as string;

    if (!searchQuery || !searchQuery.trim()) {
      toast.error('Please enter your search query.');
      return;
    }

    // Call the parent's 'action' prop with the cleaned FormData.
    // We create a new FormData object to ensure only the necessary 'query' is passed, trimmed.
    const cleanedFormData = new FormData();
    cleanedFormData.set('query', searchQuery.trim());
    action(cleanedFormData);
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
        {/* Use the 'action' prop for React Form Actions API */}
        <form className={styles.form} action={handleFormAction}>
          <input
            className={styles.input}
            type="text"
            name="query" // 'name' attribute is crucial for FormData
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