/**
 * Movie-related MCP tools
 */

import { z } from "zod";
import { TMDBClient } from "../utils/tmdb-client.js";
import type { TMDBMovie, TMDBMovieDetails } from "../types/tmdb.js";

/**
 * Zod schema for search_movies tool
 */
export const SearchMoviesSchema = z.object({
    query: z.string().min(1).describe("Movie title to search for"),
    page: z
        .number()
        .int()
        .positive()
        .optional()
        .default(1)
        .describe("Page number for paginated results (default: 1)"),
});

/**
 * Zod schema for get_movie_details tool
 */
export const GetMovieDetailsSchema = z.object({
    movie_id: z.number().int().positive().describe("TMDB movie ID"),
});

/**
 * Tool definition for search_movies
 */
export const searchMoviesTool = {
    name: "search_movies",
    description:
        "Search for movies by title. Returns a list of movies matching the search query with basic information like title, release date, overview, and rating.",
    inputSchema: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "Movie title to search for",
            },
            page: {
                type: "number",
                description: "Page number for paginated results (default: 1)",
            },
        },
        required: ["query"],
    },
};

/**
 * Tool definition for get_movie_details
 */
export const getMovieDetailsTool = {
    name: "get_movie_details",
    description:
        "Get detailed information about a specific movie using its TMDB ID. Returns comprehensive details including budget, revenue, runtime, genres, production companies, and more.",
    inputSchema: {
        type: "object",
        properties: {
            movie_id: {
                type: "number",
                description: "TMDB movie ID",
            },
        },
        required: ["movie_id"],
    },
};

/**
 * Handler for search_movies tool
 */
export async function handleSearchMovies(
    args: z.infer<typeof SearchMoviesSchema>,
    tmdbClient: TMDBClient
): Promise<string> {
    const validatedArgs = SearchMoviesSchema.parse(args);
    const result = await tmdbClient.searchMovies(validatedArgs.query, validatedArgs.page);

    const formattedResults = result.results.map((movie: TMDBMovie) => ({
        id: movie.id,
        title: movie.title,
        original_title: movie.original_title,
        release_date: movie.release_date,
        overview: movie.overview,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        popularity: movie.popularity,
        poster_path: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
        backdrop_path: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : null,
    }));

    return JSON.stringify(
        {
            page: result.page,
            total_results: result.total_results,
            total_pages: result.total_pages,
            results: formattedResults,
        },
        null,
        2
    );
}

/**
 * Handler for get_movie_details tool
 */
export async function handleGetMovieDetails(
    args: z.infer<typeof GetMovieDetailsSchema>,
    tmdbClient: TMDBClient
): Promise<string> {
    const validatedArgs = GetMovieDetailsSchema.parse(args);
    const movie: TMDBMovieDetails = await tmdbClient.getMovieDetails(validatedArgs.movie_id);

    const formattedMovie = {
        id: movie.id,
        title: movie.title,
        original_title: movie.original_title,
        tagline: movie.tagline,
        overview: movie.overview,
        release_date: movie.release_date,
        runtime: movie.runtime,
        status: movie.status,
        budget: movie.budget,
        revenue: movie.revenue,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        popularity: movie.popularity,
        genres: movie.genres,
        production_companies: movie.production_companies,
        production_countries: movie.production_countries,
        spoken_languages: movie.spoken_languages,
        poster_path: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
        backdrop_path: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : null,
    };

    return JSON.stringify(formattedMovie, null, 2);
}
