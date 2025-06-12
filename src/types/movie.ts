export interface Movie { 
    poster_path?: string | null;
    backdrop_path?: string | null;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
  }
  
  export interface MovieApiResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  }