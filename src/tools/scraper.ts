import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function scrapeJob(url: string): Promise<string> {
    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        },

    });

    const html = await response.text();
    const $ = cheerio.load(html);

     // Remove scripts and styles
    $("script, style, nav, footer, header").remove();

    const text = $("body").text()
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 3000);

    return text || "Could not read job posting.";
}

