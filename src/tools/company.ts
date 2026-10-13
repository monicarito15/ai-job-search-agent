import fetch from "node-fetch";

 export async function researchCompany(companyName: string): Promise<string> {
    const queries = [
        `${companyName} Norway tech stack`,
        `${companyName} company culture Norway`,
    ];

    const results: string[] = [];

    for (const query of queries) {
        const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`;

        const response = await fetch(url, {
        headers: {
        "Accept": "application/json",
        "X-Subscription-Token": process.env.BRAVE_API_KEY!,
    },
    });

        const data = await response.json() as any;
        const hits = data.web?.results ?? [];

        for (const hit of hits) {
            results.push(`${hit.title}\n${hit.description}`);
        }
    }

    return results.length > 0
    ? results.join("\n---\n")
    : "No information found about this company.";
}