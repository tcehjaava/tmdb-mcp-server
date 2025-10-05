/**
 * TMDB API Client
 * Handles all requests to The Movie Database API
 */

import type {
    TMDBMovie,
    TMDBMovieDetails,
    TMDBTVShow,
    TMDBTVShowDetails,
    TMDBSearchResponse,
    TMDBError,
} from "../types/tmdb.js";

export class TMDBClient {
    private readonly baseURL = "https://api.themoviedb.org/3";
    private readonly token: string;

    constructor(token: string) {
        if (!token) {
            throw new Error("TMDB_ACCESS_TOKEN is required");
        }
        this.token = token;
    }

    /**
     * Generic GET request handler
     */
    private async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        const url = new URL(`${this.baseURL}${endpoint}`);

        // Add query parameters
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const error: TMDBError = await response.json();
            throw new Error(`TMDB API Error: ${error.status_message}`);
        }

        return response.json();
    }

    /**
     * Search for movies
     */
    async searchMovies(query: string, page: number = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
        return this.get<TMDBSearchResponse<TMDBMovie>>("/search/movie", {
            query,
            page: String(page),
        });
    }

    /**
     * Get movie details by ID
     */
    async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
        return this.get<TMDBMovieDetails>(`/movie/${movieId}`);
    }

    /**
     * Search for TV shows
     */
    async searchTVShows(query: string, page: number = 1): Promise<TMDBSearchResponse<TMDBTVShow>> {
        return this.get<TMDBSearchResponse<TMDBTVShow>>("/search/tv", {
            query,
            page: String(page),
        });
    }

    /**
     * Get TV show details by ID
     */
    async getTVShowDetails(tvId: number): Promise<TMDBTVShowDetails> {
        return this.get<TMDBTVShowDetails>(`/tv/${tvId}`);
    }
}
