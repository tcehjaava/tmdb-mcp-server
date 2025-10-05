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

    /**
     * Discover movies with advanced filters
     */
    async discoverMovies(params: {
        with_genres?: string;
        primary_release_year?: number;
        "vote_average.gte"?: number;
        "vote_average.lte"?: number;
        sort_by?: string;
        page?: number;
    }): Promise<TMDBSearchResponse<TMDBMovie>> {
        const queryParams: Record<string, string> = {};

        if (params.with_genres) queryParams.with_genres = params.with_genres;
        if (params.primary_release_year)
            queryParams.primary_release_year = String(params.primary_release_year);
        if (params["vote_average.gte"])
            queryParams["vote_average.gte"] = String(params["vote_average.gte"]);
        if (params["vote_average.lte"])
            queryParams["vote_average.lte"] = String(params["vote_average.lte"]);
        if (params.sort_by) queryParams.sort_by = params.sort_by;
        if (params.page) queryParams.page = String(params.page);

        return this.get<TMDBSearchResponse<TMDBMovie>>("/discover/movie", queryParams);
    }

    /**
     * Get movie recommendations based on a movie ID
     */
    async getMovieRecommendations(
        movieId: number,
        page: number = 1
    ): Promise<TMDBSearchResponse<TMDBMovie>> {
        return this.get<TMDBSearchResponse<TMDBMovie>>(`/movie/${movieId}/recommendations`, {
            page: String(page),
        });
    }

    /**
     * Get trending movies, TV shows, or people
     */
    async getTrending(
        mediaType: "all" | "movie" | "tv" | "person",
        timeWindow: "day" | "week",
        page: number = 1
    ): Promise<TMDBSearchResponse<any>> {
        return this.get<TMDBSearchResponse<any>>(`/trending/${mediaType}/${timeWindow}`, {
            page: String(page),
        });
    }

    /**
     * Search for people by name
     */
    async searchPeople(query: string, page: number = 1): Promise<TMDBSearchResponse<any>> {
        return this.get<TMDBSearchResponse<any>>("/search/person", {
            query,
            page: String(page),
        });
    }

    /**
     * Get cast and crew for a movie
     */
    async getMovieCredits(movieId: number): Promise<any> {
        return this.get<any>(`/movie/${movieId}/credits`);
    }
}
