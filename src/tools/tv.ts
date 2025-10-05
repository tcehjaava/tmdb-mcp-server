/**
 * TV show-related MCP tools
 */

import { z } from "zod";
import { TMDBClient } from "../utils/tmdb-client.js";
import type { TMDBTVShow, TMDBTVShowDetails } from "../types/tmdb.js";

/**
 * Zod schema for search_tv_shows tool
 */
export const SearchTVShowsSchema = z.object({
    query: z.string().min(1).describe("TV show name to search for"),
    page: z
        .number()
        .int()
        .positive()
        .optional()
        .default(1)
        .describe("Page number for paginated results (default: 1)"),
});

/**
 * Zod schema for get_tv_details tool
 */
export const GetTVShowDetailsSchema = z.object({
    tv_id: z.number().int().positive().describe("TMDB TV show ID"),
});

/**
 * Tool definition for search_tv_shows
 */
export const searchTVShowsTool = {
    name: "search_tv_shows",
    description:
        "Search for TV shows by name. Returns a list of TV shows matching the search query with basic information like name, first air date, overview, and rating.",
    inputSchema: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "TV show name to search for",
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
 * Tool definition for get_tv_details
 */
export const getTVShowDetailsTool = {
    name: "get_tv_details",
    description:
        "Get detailed information about a specific TV show using its TMDB ID. Returns comprehensive details including number of seasons, episodes, networks, creators, and more.",
    inputSchema: {
        type: "object",
        properties: {
            tv_id: {
                type: "number",
                description: "TMDB TV show ID",
            },
        },
        required: ["tv_id"],
    },
};

/**
 * Handler for search_tv_shows tool
 */
export async function handleSearchTVShows(
    args: z.infer<typeof SearchTVShowsSchema>,
    tmdbClient: TMDBClient
): Promise<string> {
    const validatedArgs = SearchTVShowsSchema.parse(args);
    const result = await tmdbClient.searchTVShows(validatedArgs.query, validatedArgs.page);

    const formattedResults = result.results.map((show: TMDBTVShow) => ({
        id: show.id,
        name: show.name,
        original_name: show.original_name,
        first_air_date: show.first_air_date,
        overview: show.overview,
        vote_average: show.vote_average,
        vote_count: show.vote_count,
        popularity: show.popularity,
        origin_country: show.origin_country,
        poster_path: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null,
        backdrop_path: show.backdrop_path
            ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
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
 * Handler for get_tv_details tool
 */
export async function handleGetTVShowDetails(
    args: z.infer<typeof GetTVShowDetailsSchema>,
    tmdbClient: TMDBClient
): Promise<string> {
    const validatedArgs = GetTVShowDetailsSchema.parse(args);
    const show: TMDBTVShowDetails = await tmdbClient.getTVShowDetails(validatedArgs.tv_id);

    const formattedShow = {
        id: show.id,
        name: show.name,
        original_name: show.original_name,
        tagline: show.tagline,
        overview: show.overview,
        first_air_date: show.first_air_date,
        last_air_date: show.last_air_date,
        status: show.status,
        type: show.type,
        number_of_seasons: show.number_of_seasons,
        number_of_episodes: show.number_of_episodes,
        episode_run_time: show.episode_run_time,
        in_production: show.in_production,
        vote_average: show.vote_average,
        vote_count: show.vote_count,
        popularity: show.popularity,
        genres: show.genres,
        created_by: show.created_by,
        networks: show.networks,
        origin_country: show.origin_country,
        languages: show.languages,
        homepage: show.homepage,
        poster_path: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null,
        backdrop_path: show.backdrop_path
            ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
            : null,
    };

    return JSON.stringify(formattedShow, null, 2);
}

/**
 * Zod schema for discover_tv_shows tool
 */
export const DiscoverTVShowsSchema = z.object({
    with_genres: z
        .string()
        .optional()
        .describe(
            "Genre IDs comma-separated (10759=Action & Adventure, 16=Animation, 35=Comedy, 80=Crime, 99=Documentary, 18=Drama, 10751=Family, 10762=Kids, 9648=Mystery, 10763=News, 10764=Reality, 10765=Sci-Fi & Fantasy, 10766=Soap, 10767=Talk, 10768=War & Politics, 37=Western)"
        ),
    with_original_language: z
        .string()
        .optional()
        .describe(
            "Filter by original language using ISO 639-1 codes. Single language (e.g., 'ja') or comma-separated for multiple (e.g., 'ja,ko,zh')"
        ),
    year: z.number().int().optional().describe("First air date year filter (e.g., 2024)"),
    min_rating: z.number().min(0).max(10).optional().describe("Minimum vote average (0-10)"),
    max_rating: z.number().min(0).max(10).optional().describe("Maximum vote average (0-10)"),
    sort_by: z
        .enum([
            "popularity.desc",
            "popularity.asc",
            "vote_average.desc",
            "vote_average.asc",
            "first_air_date.desc",
            "first_air_date.asc",
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
 * Zod schema for get_tv_recommendations tool
 */
export const GetTVRecommendationsSchema = z.object({
    tv_id: z.number().int().positive().describe("TMDB TV show ID to get recommendations for"),
    page: z
        .number()
        .int()
        .positive()
        .optional()
        .default(1)
        .describe("Page number for paginated results (default: 1)"),
});

/**
 * Zod schema for get_tv_credits tool
 */
export const GetTVCreditsSchema = z.object({
    tv_id: z.number().int().positive().describe("TMDB TV show ID"),
});

/**
 * Tool definition for discover_tv_shows
 */
export const discoverTVShowsTool = {
    name: "discover_tv_shows",
    description:
        "Discover TV shows with advanced filters including genre, language, year, rating, and sorting. Perfect for finding shows that match specific criteria like 'Korean dramas from 2023 with rating above 7' or 'Japanese anime shows'.",
    inputSchema: {
        type: "object",
        properties: {
            with_genres: {
                type: "string",
                description:
                    "Genre IDs comma-separated (10759=Action & Adventure, 35=Comedy, 18=Drama, 9648=Mystery, 10765=Sci-Fi & Fantasy)",
            },
            with_original_language: {
                type: "string",
                description:
                    "Filter by original language using ISO 639-1 codes. Single language (e.g., 'ja') or comma-separated for multiple (e.g., 'ja,ko,zh')",
            },
            year: {
                type: "number",
                description: "First air date year filter",
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
                    "Sort order (popularity.desc, vote_average.desc, first_air_date.desc, etc.)",
            },
            page: {
                type: "number",
                description: "Page number (default: 1)",
            },
        },
    },
};

/**
 * Tool definition for get_tv_recommendations
 */
export const getTVRecommendationsTool = {
    name: "get_tv_recommendations",
    description:
        "Get TV show recommendations based on a specific show. Returns similar shows that users who liked the given show also enjoyed.",
    inputSchema: {
        type: "object",
        properties: {
            tv_id: {
                type: "number",
                description: "TMDB TV show ID to base recommendations on",
            },
            page: {
                type: "number",
                description: "Page number for pagination (default: 1)",
            },
        },
        required: ["tv_id"],
    },
};

/**
 * Tool definition for get_tv_credits
 */
export const getTVCreditsTool = {
    name: "get_tv_credits",
    description:
        "Get cast and crew information for a specific TV show. Returns actors with their characters and crew members with their roles/departments.",
    inputSchema: {
        type: "object",
        properties: {
            tv_id: {
                type: "number",
                description: "TMDB TV show ID",
            },
        },
        required: ["tv_id"],
    },
};

/**
 * Handler for discover_tv_shows tool
 */
export async function handleDiscoverTVShows(
    args: z.infer<typeof DiscoverTVShowsSchema>,
    tmdbClient: TMDBClient
): Promise<string> {
    const validatedArgs = DiscoverTVShowsSchema.parse(args);

    const result = await tmdbClient.discoverTVShows({
        with_genres: validatedArgs.with_genres,
        with_original_language: validatedArgs.with_original_language,
        first_air_date_year: validatedArgs.year,
        "vote_average.gte": validatedArgs.min_rating,
        "vote_average.lte": validatedArgs.max_rating,
        sort_by: validatedArgs.sort_by,
        page: validatedArgs.page,
    });

    const formattedResults = result.results.map((show: TMDBTVShow) => ({
        id: show.id,
        name: show.name,
        first_air_date: show.first_air_date,
        overview: show.overview,
        vote_average: show.vote_average,
        vote_count: show.vote_count,
        popularity: show.popularity,
        poster_path: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null,
    }));

    return JSON.stringify(
        {
            page: result.page,
            total_results: result.total_results,
            total_pages: result.total_pages,
            filters_applied: {
                genres: validatedArgs.with_genres,
                original_language: validatedArgs.with_original_language,
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
 * Handler for get_tv_recommendations tool
 */
export async function handleGetTVRecommendations(
    args: z.infer<typeof GetTVRecommendationsSchema>,
    tmdbClient: TMDBClient
): Promise<string> {
    const validatedArgs = GetTVRecommendationsSchema.parse(args);

    const result = await tmdbClient.getTVShowRecommendations(
        validatedArgs.tv_id,
        validatedArgs.page
    );

    const formattedResults = result.results.map((show: TMDBTVShow) => ({
        id: show.id,
        name: show.name,
        first_air_date: show.first_air_date,
        overview: show.overview,
        vote_average: show.vote_average,
        vote_count: show.vote_count,
        popularity: show.popularity,
        poster_path: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null,
    }));

    return JSON.stringify(
        {
            based_on_tv_id: validatedArgs.tv_id,
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
 * Handler for get_tv_credits tool
 */
export async function handleGetTVCredits(
    args: z.infer<typeof GetTVCreditsSchema>,
    tmdbClient: TMDBClient
): Promise<string> {
    const validatedArgs = GetTVCreditsSchema.parse(args);
    const credits = await tmdbClient.getTVShowCredits(validatedArgs.tv_id);

    // Format and return top 20 cast members and key crew
    const formattedCast = credits.cast.slice(0, 20).map((member: any) => ({
        id: member.id,
        name: member.name,
        character: member.character,
        profile_path: member.profile_path
            ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
            : null,
    }));

    // Filter crew to key roles
    const keyJobs = [
        "Director",
        "Producer",
        "Writer",
        "Screenplay",
        "Story",
        "Executive Producer",
        "Creator",
    ];
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
            tv_id: credits.id,
            cast: formattedCast,
            crew: formattedCrew,
        },
        null,
        2
    );
}
