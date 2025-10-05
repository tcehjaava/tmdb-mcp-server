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
