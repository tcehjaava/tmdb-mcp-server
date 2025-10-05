/**
 * People-related MCP tools
 */

import { z } from "zod";
import { TMDBClient } from "../utils/tmdb-client.js";
import type { TMDBPerson } from "../types/tmdb.js";

/**
 * Zod schema for search_people tool
 */
export const SearchPeopleSchema = z.object({
    query: z.string().min(1).describe("Person name to search for"),
    page: z
        .number()
        .int()
        .positive()
        .optional()
        .default(1)
        .describe("Page number for paginated results (default: 1)"),
});

/**
 * Tool definition for search_people
 */
export const searchPeopleTool = {
    name: "search_people",
    description:
        "Search for people (actors, directors, producers, crew) by name. Returns basic info including profile photo, known for department, and movies/TV shows they're known for.",
    inputSchema: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "Person name to search for",
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
 * Handler for search_people tool
 */
export async function handleSearchPeople(
    args: z.infer<typeof SearchPeopleSchema>,
    tmdbClient: TMDBClient
): Promise<string> {
    const validatedArgs = SearchPeopleSchema.parse(args);
    const result = await tmdbClient.searchPeople(validatedArgs.query, validatedArgs.page);

    const formattedResults = result.results.map((person: TMDBPerson) => ({
        id: person.id,
        name: person.name,
        known_for_department: person.known_for_department,
        popularity: person.popularity,
        profile_path: person.profile_path
            ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
            : null,
        known_for: person.known_for?.map((item: any) => ({
            id: item.id,
            title: item.title || item.name,
            media_type: item.media_type,
            vote_average: item.vote_average,
        })),
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
