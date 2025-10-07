# Contributing to TMDB MCP Server

Thank you for your interest in contributing to the TMDB MCP Server! We welcome contributions from the community.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/tmdb-mcp-server.git
   cd tmdb-mcp-server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file with your TMDB access token:
   ```bash
   cp .env.example .env
   # Add your TMDB_ACCESS_TOKEN
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test them:
   ```bash
   npm run build
   npm run inspector  # Use MCP Inspector to test your changes
   ```

3. Format your code:
   ```bash
   npm run format
   ```

4. Commit your changes with a clear commit message:
   ```bash
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue with..."
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request on GitHub

## Code Style

- We use [Prettier](https://prettier.io/) for code formatting
- Run `npm run format` before committing
- Follow TypeScript best practices
- Use meaningful variable and function names

## Commit Message Convention

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Adding New Tools

If you're adding a new TMDB API tool:

1. Add the tool definition and handler in the appropriate file:
   - `src/tools/movies.ts` for movie-related tools
   - `src/tools/tv.ts` for TV show-related tools
   - `src/tools/people.ts` for people-related tools

2. Add the tool to the list in `src/index.ts`:
   - Import the tool and handler
   - Add to the `ListToolsRequestSchema` handler
   - Add a case in the `CallToolRequestSchema` handler

3. Update the README.md to document the new tool

4. Test the tool using the MCP Inspector

## Testing

Before submitting a PR:

1. Build the project: `npm run build`
2. Test with MCP Inspector: `npm run inspector`
3. Test with Claude Desktop if possible
4. Verify all existing tools still work

## Pull Request Guidelines

- Provide a clear description of the changes
- Link to any related issues
- Include screenshots or examples if applicable
- Ensure the code builds successfully
- Update documentation if needed

## Questions?

Feel free to open an issue if you have questions or need help!

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the open source etiquette

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
