/**
 * Test script for the 3 new TMDB MCP tools:
 * - get_trending
 * - search_people
 * - get_movie_credits
 */

import { TMDBClient } from "./build/utils/tmdb-client.js";
import { config } from "dotenv";

config();

const client = new TMDBClient(process.env.TMDB_ACCESS_TOKEN);

console.log("=".repeat(60));
console.log("Testing 3 New TMDB MCP Tools");
console.log("=".repeat(60));

try {
    // Test 1: Trending movies this week
    console.log("\n📈 Test 1: Get Trending Movies (Week)");
    console.log("-".repeat(60));
    const trendingMovies = await client.getTrending("movie", "week", 1);
    console.log(`✓ Found ${trendingMovies.results.length} trending movies`);
    console.log("Top 3 trending movies:");
    trendingMovies.results.slice(0, 3).forEach((movie, i) => {
        console.log(`  ${i + 1}. ${movie.title} (${movie.vote_average?.toFixed(1)}★)`);
    });

    // Test 2: Trending all content (movies, TV, people)
    console.log("\n📈 Test 2: Get Trending All (Week)");
    console.log("-".repeat(60));
    const trendingAll = await client.getTrending("all", "week", 1);
    console.log(`✓ Found ${trendingAll.results.length} trending items`);
    console.log("Top 5 trending items:");
    trendingAll.results.slice(0, 5).forEach((item, i) => {
        const name = item.title || item.name;
        console.log(`  ${i + 1}. [${item.media_type}] ${name}`);
    });

    // Test 3: Trending daily
    console.log("\n📈 Test 3: Get Trending Movies (Day)");
    console.log("-".repeat(60));
    const trendingDaily = await client.getTrending("movie", "day", 1);
    console.log(`✓ Found ${trendingDaily.results.length} trending movies today`);
    console.log(`Top movie: ${trendingDaily.results[0].title}`);

    // Test 4: Search people - Tom Hanks
    console.log("\n👤 Test 4: Search People (Tom Hanks)");
    console.log("-".repeat(60));
    const peopleSearch = await client.searchPeople("Tom Hanks", 1);
    console.log(`✓ Found ${peopleSearch.results.length} results`);
    const tomHanks = peopleSearch.results[0];
    console.log(`Name: ${tomHanks.name}`);
    console.log(`Known for: ${tomHanks.known_for_department}`);
    console.log(`Popularity: ${tomHanks.popularity.toFixed(1)}`);
    if (tomHanks.known_for && tomHanks.known_for.length > 0) {
        console.log(`Famous movies:`);
        tomHanks.known_for.slice(0, 3).forEach((movie) => {
            console.log(`  - ${movie.title || movie.name} (${movie.vote_average?.toFixed(1)}★)`);
        });
    }

    // Test 5: Search people - Christopher Nolan
    console.log("\n👤 Test 5: Search People (Christopher Nolan)");
    console.log("-".repeat(60));
    const nolanSearch = await client.searchPeople("Christopher Nolan", 1);
    const nolan = nolanSearch.results[0];
    console.log(`✓ Name: ${nolan.name}`);
    console.log(`Known for: ${nolan.known_for_department}`);
    console.log(`Famous for: ${nolan.known_for?.slice(0, 2).map(m => m.title || m.name).join(", ")}`);

    // Test 6: Get movie credits for Inception (27205)
    console.log("\n🎬 Test 6: Get Movie Credits (Inception)");
    console.log("-".repeat(60));
    const inceptionCredits = await client.getMovieCredits(27205);
    console.log(`✓ Cast members: ${inceptionCredits.cast.length}`);
    console.log(`✓ Crew members: ${inceptionCredits.crew.length}`);
    console.log("\nTop 5 cast:");
    inceptionCredits.cast.slice(0, 5).forEach((member, i) => {
        console.log(`  ${i + 1}. ${member.name} as ${member.character}`);
    });
    console.log("\nKey crew:");
    inceptionCredits.crew
        .filter((m) => ["Director", "Producer", "Writer"].includes(m.job))
        .slice(0, 5)
        .forEach((member) => {
            console.log(`  - ${member.name} (${member.job})`);
        });

    // Test 7: Get movie credits for The Dark Knight (155)
    console.log("\n🎬 Test 7: Get Movie Credits (The Dark Knight)");
    console.log("-".repeat(60));
    const darkKnightCredits = await client.getMovieCredits(155);
    console.log(`✓ Cast: ${darkKnightCredits.cast.length} members`);
    console.log(`✓ Crew: ${darkKnightCredits.crew.length} members`);
    const director = darkKnightCredits.crew.find((m) => m.job === "Director");
    console.log(`Director: ${director?.name}`);
    console.log(`Top billed: ${darkKnightCredits.cast[0].name} as ${darkKnightCredits.cast[0].character}`);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("✅ All 7 tests passed successfully!");
    console.log("=".repeat(60));
    console.log("\nNew tools tested:");
    console.log("  ✓ get_trending - 3 tests (movie/week, all/week, movie/day)");
    console.log("  ✓ search_people - 2 tests (Tom Hanks, Christopher Nolan)");
    console.log("  ✓ get_movie_credits - 2 tests (Inception, The Dark Knight)");
    console.log("\nTotal MCP tools: 9 (was 6, added 3 new)");
} catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.error(error);
    process.exit(1);
}
