export interface Movie {
    id: number;
    poster_path: string | null; // Made nullable based on common API responses
    backdrop_path: string | null; // Made nullable
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    // Added properties that might be returned by the API based on previous contexts
    adult?: boolean;
    genre_ids?: number[];
    original_language?: string;
    original_title?: string;
    popularity?: number;
    video?: boolean;
    vote_count?: number;
  }