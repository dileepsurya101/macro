/**
 * Web search service.
 * TODO: Replace the mock below with a real search API integration.
 * Options:
 *   - SerpAPI: https://serpapi.com/
 *   - Brave Search API: https://api.search.brave.com/
 *   - Tavily: https://docs.tavily.com/
 * Set SEARCH_API_KEY in .env and implement the fetch call below.
 */
export async function webSearch(query) {
  console.log('[webSearchService] Mock search for:', query);

  // TODO: Replace this with a real API call, e.g.:
  // const res = await fetch(`https://api.example.com/search?q=${encodeURIComponent(query)}`, {
  //   headers: { 'X-API-Key': process.env.SEARCH_API_KEY },
  // });
  // const data = await res.json();
  // return data.results.map(r => r.snippet).join('\n');

  return `[Mock web search] Top results for "${query}":\n1. Example result A - relevant info here.\n2. Example result B - more info here.\n(Integrate a real search API to replace this mock.)`;
}
