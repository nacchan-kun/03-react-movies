import toast from 'react-hot-toast';
import styles from './SearchBar.module.css';

// CRITICAL FIX 1: Interface must define 'onSubmit' that takes a 'string'
interface SearchBarProps {
  onSubmit: (query: string) => void;
}

// CRITICAL FIX 2: Destructure 'onSubmit' prop
export default function SearchBar({ onSubmit }: SearchBarProps) {
  // CRITICAL FIX 3: Change handler to process form event and extract string query
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Standard practice to prevent page reload

    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get("query") as string;

    if (!searchQuery || !searchQuery.trim()) {
      toast.error('Please enter your search query.');
      return;
    }

    // CRITICAL FIX 4: Call the parent's 'onSubmit' with ONLY the string query
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
        {/* CRITICAL FIX 5: Use standard 'onSubmit' event handler on the form */}
        <form className={styles.form} onSubmit={handleFormSubmit}>
          <input
            className={styles.input}
            type="text"
            name="query" // Ensure name="query" is present to extract data
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