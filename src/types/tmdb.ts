/**
 * TMDB API Response Types
 * Based on The Movie Database API v3
 */

export interface TMDBMovie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    release_date: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    vote_count: number;
    popularity: number;
    adult: boolean;
    genre_ids?: number[];
    original_language: string;
    video: boolean;
}

export interface TMDBMovieDetails extends TMDBMovie {
    budget: number;
    revenue: number;
    runtime: number | null;
    status: string;
    tagline: string | null;
    genres: Array<{ id: number; name: string }>;
    production_companies: Array<{
        id: number;
        name: string;
        logo_path: string | null;
        origin_country: string;
    }>;
    production_countries: Array<{
        iso_3166_1: string;
        name: string;
    }>;
    spoken_languages: Array<{
        iso_639_1: string;
        name: string;
        english_name: string;
    }>;
}

export interface TMDBTVShow {
    id: number;
    name: string;
    original_name: string;
    overview: string;
    first_air_date: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    vote_count: number;
    popularity: number;
    genre_ids?: number[];
    origin_country: string[];
    original_language: string;
}

export interface TMDBTVShowDetails extends TMDBTVShow {
    created_by: Array<{
        id: number;
        name: string;
        credit_id: string;
        gender: number;
        profile_path: string | null;
    }>;
    episode_run_time: number[];
    genres: Array<{ id: number; name: string }>;
    homepage: string;
    in_production: boolean;
    languages: string[];
    last_air_date: string;
    number_of_episodes: number;
    number_of_seasons: number;
    status: string;
    tagline: string;
    type: string;
    networks: Array<{
        id: number;
        name: string;
        logo_path: string | null;
        origin_country: string;
    }>;
}

export interface TMDBSearchResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface TMDBError {
    status_code: number;
    status_message: string;
    success: boolean;
}

/**
 * Person from search results
 */
export interface TMDBPerson {
    id: number;
    name: string;
    profile_path: string | null;
    adult: boolean;
    popularity: number;
    gender: number; // 0=Not set, 1=Female, 2=Male, 3=Non-binary
    known_for_department: string; // "Acting", "Directing", etc.
    known_for: Array<TMDBMovie | TMDBTVShow>; // Movies/TV they're known for
}

/**
 * Cast member in movie credits
 */
export interface TMDBCastMember {
    id: number;
    name: string;
    character: string;
    credit_id: string;
    order: number; // Billing order (0 = top billing)
    profile_path: string | null;
    gender: number;
    known_for_department: string;
}

/**
 * Crew member in movie credits
 */
export interface TMDBCrewMember {
    id: number;
    name: string;
    job: string; // "Producer", "Writer", "Director of Photography"
    department: string; // "Production", "Writing", "Camera"
    credit_id: string;
    profile_path: string | null;
    gender: number;
}

/**
 * Credits response for a movie
 */
export interface TMDBCreditsResponse {
    id: number; // Movie ID
    cast: TMDBCastMember[];
    crew: TMDBCrewMember[];
}

/**
 * Trending item (can be movie, TV, or person with media_type)
 */
export interface TMDBTrendingItem {
    media_type: "movie" | "tv" | "person";
    id: number;
    popularity: number;
    vote_average?: number;
    // Movie-specific fields
    title?: string;
    release_date?: string;
    // TV-specific fields
    name?: string;
    first_air_date?: string;
    // Person-specific fields
    known_for_department?: string;
    // Additional dynamic fields
    [key: string]: any;
}
