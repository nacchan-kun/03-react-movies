
export interface Movie {
    id: number; // <--- ADDED: Movie ID is essential
    poster_path?: string | null;
    backdrop_path?: string | null;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    // Add any other properties you expect from your API for a single movie
    // (e.g., 'genre_ids', 'popularity', 'adult', 'video', 'original_language', etc., if you need them)
  }
  
  export interface MovieApiResponse {
    page: number;
    results: Movie[]; // This must be an array of the corrected Movie type
    total_pages: number;
    total_results: number;
    // Add any other top-level properties you expect from the API response (e.g., 'dates' for upcoming/now_playing)
  }