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
 *
 * Supports two transport modes:
 * - stdio: For local Claude Desktop integration (default)
 * - http: For remote deployment via Streamable HTTP (Railway, etc.)
 */

import { config } from "dotenv";
import { randomUUID } from "crypto";
import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// Import TMDB client
import { TMDBClient } from "./utils/tmdb-client.js";

// Import movie tools
import {
    searchMoviesTool,
    getMovieDetailsTool,
    discoverMoviesTool,
    getRecommendationsTool,
    getTrendingTool,
    getMovieCreditsTool,
    handleSearchMovies,
    handleGetMovieDetails,
    handleDiscoverMovies,
    handleGetRecommendations,
    handleGetTrending,
    handleGetMovieCredits,
    SearchMoviesSchema,
    GetMovieDetailsSchema,
    DiscoverMoviesSchema,
    GetRecommendationsSchema,
    GetTrendingSchema,
    GetMovieCreditsSchema,
} from "./tools/movies.js";

// Import TV show tools
import {
    searchTVShowsTool,
    getTVShowDetailsTool,
    discoverTVShowsTool,
    getTVRecommendationsTool,
    getTVCreditsTool,
    handleSearchTVShows,
    handleGetTVShowDetails,
    handleDiscoverTVShows,
    handleGetTVRecommendations,
    handleGetTVCredits,
    SearchTVShowsSchema,
    GetTVShowDetailsSchema,
    DiscoverTVShowsSchema,
    GetTVRecommendationsSchema,
    GetTVCreditsSchema,
} from "./tools/tv.js";

// Import people tools
import {
    searchPeopleTool,
    getPersonDetailsTool,
    handleSearchPeople,
    handleGetPersonDetails,
    SearchPeopleSchema,
    GetPersonDetailsSchema,
} from "./tools/people.js";

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
 * Returns all 13 TMDB tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            searchMoviesTool,
            getMovieDetailsTool,
            discoverMoviesTool,
            getRecommendationsTool,
            getTrendingTool,
            getMovieCreditsTool,
            searchTVShowsTool,
            getTVShowDetailsTool,
            discoverTVShowsTool,
            getTVRecommendationsTool,
            getTVCreditsTool,
            searchPeopleTool,
            getPersonDetailsTool,
        ],
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

            case "discover_movies": {
                const validatedArgs = DiscoverMoviesSchema.parse(args);
                const result = await handleDiscoverMovies(validatedArgs, tmdbClient);
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }

            case "get_recommendations": {
                const validatedArgs = GetRecommendationsSchema.parse(args);
                const result = await handleGetRecommendations(validatedArgs, tmdbClient);
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

            case "get_trending": {
                const validatedArgs = GetTrendingSchema.parse(args);
                const result = await handleGetTrending(validatedArgs, tmdbClient);
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }

            case "get_movie_credits": {
                const validatedArgs = GetMovieCreditsSchema.parse(args);
                const result = await handleGetMovieCredits(validatedArgs, tmdbClient);
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }

            case "search_people": {
                const validatedArgs = SearchPeopleSchema.parse(args);
                const result = await handleSearchPeople(validatedArgs, tmdbClient);
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }

            case "get_person_details": {
                const validatedArgs = GetPersonDetailsSchema.parse(args);
                const result = await handleGetPersonDetails(validatedArgs, tmdbClient);
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }

            case "discover_tv_shows": {
                const validatedArgs = DiscoverTVShowsSchema.parse(args);
                const result = await handleDiscoverTVShows(validatedArgs, tmdbClient);
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }

            case "get_tv_recommendations": {
                const validatedArgs = GetTVRecommendationsSchema.parse(args);
                const result = await handleGetTVRecommendations(validatedArgs, tmdbClient);
                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            }

            case "get_tv_credits": {
                const validatedArgs = GetTVCreditsSchema.parse(args);
                const result = await handleGetTVCredits(validatedArgs, tmdbClient);
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
 * Start server with stdio transport
 * Used for local Claude Desktop integration
 */
async function startStdioServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("TMDB MCP Server running on stdio");
    console.error("Ready for Claude Desktop connection");
}

/**
 * Start server with Streamable HTTP transport
 * Used for remote deployment (Railway, etc.)
 */
async function startHttpServer() {
    const app = express();
    const port = process.env.PORT || 3000;

    // Parse JSON bodies
    app.use(express.json());

    // Health check endpoint
    app.get("/health", (_req, res) => {
        res.json({
            status: "ok",
            server: "tmdb-mcp-server",
            version: "0.1.0",
            transport: "streamable-http",
        });
    });

    // MCP Streamable HTTP endpoint
    app.all("/mcp", async (req, res) => {
        console.error(
            `[HTTP] ${req.method} ${req.path} - Session: ${req.headers["mcp-session-id"] || "new"}`
        );

        // Create a new transport for each request to prevent request ID collisions
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            enableJsonResponse: true,
        });

        try {
            await transport.handleRequest(req, res, req.body);
        } catch (error) {
            console.error("[HTTP] Error handling request:", error);
            if (!res.headersSent) {
                res.status(500).json({
                    error: "Internal server error",
                    message: error instanceof Error ? error.message : "Unknown error",
                });
            }
        }
    });

    // 404 handler
    app.use((_req, res) => {
        res.status(404).json({
            error: "Not found",
            message: "Endpoint not found. Use /mcp for MCP protocol or /health for status check",
        });
    });

    // Start HTTP server
    app.listen(port, () => {
        console.error(`TMDB MCP Server running on HTTP`);
        console.error(`Port: ${port}`);
        console.error(`MCP endpoint: http://localhost:${port}/mcp`);
        console.error(`Health check: http://localhost:${port}/health`);
        console.error("Ready for remote MCP connections");
    });
}

/**
 * Main entry point
 * Chooses transport based on MCP_TRANSPORT environment variable
 */
async function main() {
    const transportMode = process.env.MCP_TRANSPORT || "stdio";

    console.error("=".repeat(50));
    console.error("TMDB MCP Server");
    console.error("=".repeat(50));
    console.error(`Transport mode: ${transportMode}`);
    console.error(`Node environment: ${process.env.NODE_ENV || "production"}`);
    console.error("=".repeat(50));

    if (transportMode === "http") {
        await startHttpServer();
    } else {
        await startStdioServer();
    }
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
