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

/**
 * Zod schema for discover_movies tool
 */
export const DiscoverMoviesSchema = z.object({
    with_genres: z
        .string()
        .optional()
        .describe(
            "Genre IDs comma-separated (28=Action, 12=Adventure, 16=Animation, 35=Comedy, 80=Crime, 99=Documentary, 18=Drama, 10751=Family, 14=Fantasy, 36=History, 27=Horror, 10402=Music, 9648=Mystery, 10749=Romance, 878=Science Fiction, 10770=TV Movie, 53=Thriller, 10752=War, 37=Western)"
        ),
    year: z.number().int().optional().describe("Release year filter (e.g., 2024)"),
    min_rating: z.number().min(0).max(10).optional().describe("Minimum vote average (0-10)"),
    max_rating: z.number().min(0).max(10).optional().describe("Maximum vote average (0-10)"),
    sort_by: z
        .enum([
            "popularity.desc",
            "popularity.asc",
            "vote_average.desc",
            "vote_average.asc",
            "release_date.desc",
            "release_date.asc",
        ])
        .optional()
        .default("popularity.desc")
        .describe("Sort order for results"),
    page: z
        .number()
        .int()
        .positive()
        .optional()
        .default(1)
        .describe("Page number for paginated results (default: 1)"),
});

/**
 * Zod schema for get_recommendations tool
 */
export const GetRecommendationsSchema = z.object({
    movie_id: z.number().int().positive().describe("TMDB movie ID to get recommendations for"),
    page: z
        .number()
        .int()
        .positive()
        .optional()
        .default(1)
        .describe("Page number for paginated results (default: 1)"),
});

/**
 * Tool definition for discover_movies
 */
export const discoverMoviesTool = {
    name: "discover_movies",
    description:
        "Discover movies with advanced filters including genre, year, rating, and sorting. Perfect for finding movies that match specific criteria like 'sci-fi movies from 2023 with rating above 7' or 'popular action comedies'.",
    inputSchema: {
        type: "object",
        properties: {
            with_genres: {
                type: "string",
                description:
                    "Genre IDs comma-separated (28=Action, 12=Adventure, 16=Animation, 35=Comedy, 80=Crime, 99=Documentary, 18=Drama, 10751=Family, 14=Fantasy, 36=History, 27=Horror, 10402=Music, 9648=Mystery, 10749=Romance, 878=Science Fiction, 10770=TV Movie, 53=Thriller, 10752=War, 37=Western)",
            },
            year: {
                type: "number",
                description: "Release year filter",
            },
            min_rating: {
                type: "number",
                description: "Minimum vote average (0-10)",
            },
            max_rating: {
                type: "number",
                description: "Maximum vote average (0-10)",
            },
            sort_by: {
                type: "string",
                description:
                    "Sort order (popularity.desc, popularity.asc, vote_average.desc, vote_average.asc, release_date.desc, release_date.asc)",
            },
            page: {
                type: "number",
                description: "Page number (default: 1)",
            },
        },
    },
};

/**
 * Tool definition for get_recommendations
 */
export const getRecommendationsTool = {
    name: "get_recommendations",
    description:
        "Get movie recommendations based on a specific movie. Returns similar movies that users who liked the given movie also enjoyed. Great for 'If you liked X, try Y' suggestions.",
    inputSchema: {
        type: "object",
        properties: {
            movie_id: {
                type: "number",
                description: "TMDB movie ID to base recommendations on",
            },
            page: {
                type: "number",
                description: "Page number for pagination (default: 1)",
            },
        },
        required: ["movie_id"],
    },
};

/**
 * Handler for discover_movies tool
 */
export async function handleDiscoverMovies(
    args: z.infer<typeof DiscoverMoviesSchema>,
    tmdbClient: TMDBClient
): Promise<string> {
    const validatedArgs = DiscoverMoviesSchema.parse(args);

    const result = await tmdbClient.discoverMovies({
        with_genres: validatedArgs.with_genres,
        primary_release_year: validatedArgs.year,
        "vote_average.gte": validatedArgs.min_rating,
        "vote_average.lte": validatedArgs.max_rating,
        sort_by: validatedArgs.sort_by,
        page: validatedArgs.page,
    });

    const formattedResults = result.results.map((movie: TMDBMovie) => ({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        overview: movie.overview,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        popularity: movie.popularity,
        poster_path: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
    }));

    return JSON.stringify(
        {
            page: result.page,
            total_results: result.total_results,
            total_pages: result.total_pages,
            filters_applied: {
                genres: validatedArgs.with_genres,
                year: validatedArgs.year,
                min_rating: validatedArgs.min_rating,
                max_rating: validatedArgs.max_rating,
                sort_by: validatedArgs.sort_by,
            },
            results: formattedResults,
        },
        null,
        2
    );
}

/**
 * Handler for get_recommendations tool
 */
export async function handleGetRecommendations(
    args: z.infer<typeof GetRecommendationsSchema>,
    tmdbClient: TMDBClient
): Promise<string> {
    const validatedArgs = GetRecommendationsSchema.parse(args);

    const result = await tmdbClient.getMovieRecommendations(
        validatedArgs.movie_id,
        validatedArgs.page
    );

    const formattedResults = result.results.map((movie: TMDBMovie) => ({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        overview: movie.overview,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        popularity: movie.popularity,
        poster_path: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
    }));

    return JSON.stringify(
        {
            based_on_movie_id: validatedArgs.movie_id,
            page: result.page,
            total_results: result.total_results,
            total_pages: result.total_pages,
            recommendations: formattedResults,
        },
        null,
        2
    );
}

/**
 * Zod schema for get_trending tool
 */
export const GetTrendingSchema = z.object({
    media_type: z
        .enum(["all", "movie", "tv", "person"])
        .default("all")
        .describe("Type of content: all, movie, tv, or person"),
    time_window: z
        .enum(["day", "week"])
        .default("week")
        .describe("Time period: day (24 hours) or week (7 days)"),
    page: z
        .number()
        .int()
        .positive()
        .optional()
        .default(1)
        .describe("Page number for paginated results (default: 1)"),
});

/**
 * Zod schema for get_movie_credits tool
 */
export const GetMovieCreditsSchema = z.object({
    movie_id: z.number().int().positive().describe("TMDB movie ID"),
});

/**
 * Tool definition for get_trending
 */
export const getTrendingTool = {
    name: "get_trending",
    description:
        "Get daily or weekly trending movies, TV shows, or people. Returns what's currently popular on TMDB based on user activity.",
    inputSchema: {
        type: "object",
        properties: {
            media_type: {
                type: "string",
                description: "Content type: all, movie, tv, or person (default: all)",
            },
            time_window: {
                type: "string",
                description: "Time period: day or week (default: week)",
            },
            page: {
                type: "number",
                description: "Page number for paginated results (default: 1)",
            },
        },
    },
};

/**
 * Tool definition for get_movie_credits
 */
export const getMovieCreditsTool = {
    name: "get_movie_credits",
    description:
        "Get cast and crew information for a specific movie. Returns actors with their characters and crew members with their roles/departments.",
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
 * Handler for get_trending tool
 */
export async function handleGetTrending(
    args: z.infer<typeof GetTrendingSchema>,
    tmdbClient: TMDBClient
): Promise<string> {
    const validatedArgs = GetTrendingSchema.parse(args);

    const result = await tmdbClient.getTrending(
        validatedArgs.media_type,
        validatedArgs.time_window,
        validatedArgs.page
    );

    const formattedResults = result.results.map((item: any) => {
        const base = {
            id: item.id,
            media_type: item.media_type,
            popularity: item.popularity,
            vote_average: item.vote_average,
        };

        if (item.media_type === "movie") {
            return {
                ...base,
                title: item.title,
                release_date: item.release_date,
                overview: item.overview,
            };
        } else if (item.media_type === "tv") {
            return {
                ...base,
                name: item.name,
                first_air_date: item.first_air_date,
                overview: item.overview,
            };
        } else {
            // person
            return {
                ...base,
                name: item.name,
                known_for_department: item.known_for_department,
            };
        }
    });

    return JSON.stringify(
        {
            media_type: validatedArgs.media_type,
            time_window: validatedArgs.time_window,
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
 * Handler for get_movie_credits tool
 */
export async function handleGetMovieCredits(
    args: z.infer<typeof GetMovieCreditsSchema>,
    tmdbClient: TMDBClient
): Promise<string> {
    const validatedArgs = GetMovieCreditsSchema.parse(args);
    const credits = await tmdbClient.getMovieCredits(validatedArgs.movie_id);

    // Format and return top 20 cast members and key crew
    const formattedCast = credits.cast.slice(0, 20).map((member: any) => ({
        id: member.id,
        name: member.name,
        character: member.character,
        order: member.order,
        profile_path: member.profile_path
            ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
            : null,
    }));

    // Filter crew to key roles: Directors, Producers, Writers
    const keyJobs = ["Director", "Producer", "Writer", "Screenplay", "Story", "Executive Producer"];
    const formattedCrew = credits.crew
        .filter((member: any) => keyJobs.includes(member.job))
        .map((member: any) => ({
            id: member.id,
            name: member.name,
            job: member.job,
            department: member.department,
        }));

    return JSON.stringify(
        {
            movie_id: credits.id,
            cast: formattedCast,
            crew: formattedCrew,
        },
        null,
        2
    );
}
