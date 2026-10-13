 import fetch from "node-fetch";

export async function searchJobs(query: string): Promise<string> {
    const sites = ["finn.no", "linkedin.com/jobs", "karriere.no", "nav.no", "indeed.com", "jobbnorge.no"];
    const results: string[] = [];

    for (const site of sites) {
    const searchQuery = `${query} site:${site}`;
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchQuery)}&count=5`;

    const response = await fetch(url, {
        headers: {
        "Accept": "application/json",
        "X-Subscription-Token": process.env.BRAVE_API_KEY!,
        },
    });

    const data = await response.json() as any;
    const hits = data.web?.results ?? [];

    for (const hit of hits) {
        results.push(`TITLE: ${hit.title}\nURL: ${hit.url}\nDESCRIPTION: ${hit.description}\n`);
    }
    }

    return results.length > 0
    ? results.join("\n---\n")
    : "No jobs found. Try a different search.";
}