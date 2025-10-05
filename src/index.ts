#!/usr/bin/env node

/**
 * TMDB MCP Server
 * Provides access to The Movie Database (TMDB) API through Model Context Protocol
 *
 * Available tools:
 * - search_movies: Search for movies by title
 * - get_movie_details: Get detailed information about a specific movie
 * - search_tv_shows: Search for TV shows by name
 * - get_tv_details: Get detailed information about a specific TV show
 */

import { config } from "dotenv";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// Import TMDB client
import { TMDBClient } from "./utils/tmdb-client.js";

// Import movie tools
import {
    searchMoviesTool,
    getMovieDetailsTool,
    handleSearchMovies,
    handleGetMovieDetails,
    SearchMoviesSchema,
    GetMovieDetailsSchema,
} from "./tools/movies.js";

// Import TV show tools
import {
    searchTVShowsTool,
    getTVShowDetailsTool,
    handleSearchTVShows,
    handleGetTVShowDetails,
    SearchTVShowsSchema,
    GetTVShowDetailsSchema,
} from "./tools/tv.js";

// Load environment variables
config();

// Initialize TMDB client
const tmdbToken = process.env.TMDB_ACCESS_TOKEN;
if (!tmdbToken) {
    console.error("Error: TMDB_ACCESS_TOKEN environment variable is required");
    process.exit(1);
}

const tmdbClient = new TMDBClient(tmdbToken);

/**
 * Create MCP server with tools capability
 */
const server = new Server(
    {
        name: "tmdb-mcp-server",
        version: "0.1.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

/**
 * Handler for listing available tools
 * Returns all 4 TMDB tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [searchMoviesTool, getMovieDetailsTool, searchTVShowsTool, getTVShowDetailsTool],
    };
});

/**
 * Handler for tool execution
 * Routes tool calls to appropriate handlers
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const { name, arguments: args } = request.params;

        switch (name) {
            case "search_movies": {
                const validatedArgs = SearchMoviesSchema.parse(args);
                const result = await handleSearchMovies(validatedArgs, tmdbClient);
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }

            case "get_movie_details": {
                const validatedArgs = GetMovieDetailsSchema.parse(args);
                const result = await handleGetMovieDetails(validatedArgs, tmdbClient);
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }

            case "search_tv_shows": {
                const validatedArgs = SearchTVShowsSchema.parse(args);
                const result = await handleSearchTVShows(validatedArgs, tmdbClient);
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }

            case "get_tv_details": {
                const validatedArgs = GetTVShowDetailsSchema.parse(args);
                const result = await handleGetTVShowDetails(validatedArgs, tmdbClient);
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        // Handle Zod validation errors and API errors
        if (error instanceof Error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${error.message}`,
                    },
                ],
                isError: true,
            };
        }
        throw error;
    }
});

/**
 * Start the server using stdio transport
 * This allows the server to communicate via standard input/output streams
 */
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("TMDB MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
