import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function scrapeJob(url: string): Promise<string> {
    let html: string;
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            },
        });
        html = await response.text();
    } catch {
        return "Could not read job posting: URL unreachable. Skip this job.";
    }
    const $ = cheerio.load(html);

     // Remove scripts and styles
    $("script, style, nav, footer, header").remove();

    const text = $("body").text()
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 3000);

    if (text.includes("Fristen er utløpt") || text.includes("fristen er utløpt")) {
        return "EXPIRED: This job posting is no longer active. Skip it.";
    }

    return text || "Could not read job posting.";
}

