# TMDB MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides access to [The Movie Database (TMDB)](https://www.themoviedb.org/) API. This server enables Claude and other MCP clients to search for movies, TV shows, and people, as well as get detailed information and recommendations.

## Features

### 🎬 Movie Tools
- **search_movies** - Search for movies by title
- **get_movie_details** - Get detailed information about a specific movie (budget, revenue, runtime, genres, etc.)
- **discover_movies** - Discover movies with advanced filters (genre, language, year range, rating, sorting)
- **get_recommendations** - Get movie recommendations based on a specific movie
- **get_movie_credits** - Get cast and crew information for a movie

### 📺 TV Show Tools
- **search_tv_shows** - Search for TV shows by name
- **get_tv_details** - Get detailed information about a specific TV show (seasons, episodes, networks, etc.)
- **discover_tv_shows** - Discover TV shows with advanced filters (genre, language, year, rating, sorting)
- **get_tv_recommendations** - Get TV show recommendations based on a specific show
- **get_tv_credits** - Get cast and crew information for a TV show

### 👥 People Tools
- **search_people** - Search for actors, directors, and other entertainment industry professionals
- **get_person_details** - Get detailed biographical information about a person

### 🔥 Trending
- **get_trending** - Get daily or weekly trending movies, TV shows, or people

## Installation

### Prerequisites
- Node.js (v18 or higher)
- A TMDB API access token (get one free at [TMDB](https://www.themoviedb.org/settings/api))

### Setup

1. Clone the repository:
```bash
git clone https://github.com/tejachava/tmdb-mcp-server.git
cd tmdb-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your TMDB access token:
```bash
cp .env.example .env
# Edit .env and add your TMDB_ACCESS_TOKEN
```

4. Build the server:
```bash
npm run build
```

## Usage

### With Claude Desktop

Add the server to your Claude Desktop configuration:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "tmdb": {
      "command": "node",
      "args": ["/absolute/path/to/tmdb-mcp-server/build/index.js"],
      "env": {
        "TMDB_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

### With Other MCP Clients

The server runs on stdio by default, making it compatible with any MCP client that supports stdio transport.

### Remote Deployment (HTTP Mode)

The server also supports Streamable HTTP transport for remote deployment:

```bash
MCP_TRANSPORT=http PORT=3000 node build/index.js
```

See [TRANSPORT.md](TRANSPORT.md) for detailed deployment instructions for platforms like Railway.

## Development

### Local Development

Run the server in watch mode for development:
```bash
npm run watch
```

### Debugging

Use the MCP Inspector for debugging:
```bash
npm run inspector
```

The Inspector provides a web interface for testing and debugging MCP tools.

### Code Formatting

Format code with Prettier:
```bash
npm run format
```

## Example Queries

Here are some example queries you can try with Claude:

- "Find Japanese sci-fi movies from 2020 onwards with a rating above 7"
- "What are the top trending movies this week?"
- "Get me recommendations based on The Matrix"
- "Search for Christopher Nolan movies"
- "Show me details about the TV show Breaking Bad"
- "Find Korean dramas with high ratings"

## API Rate Limits

TMDB API has rate limits on their free tier:
- 50 requests per second
- Consider implementing caching for production use

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol)
- Data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)
- This product uses the TMDB API but is not endorsed or certified by TMDB

## Links

- [MCP Documentation](https://modelcontextprotocol.io)
- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [Claude Desktop](https://claude.ai/download)
