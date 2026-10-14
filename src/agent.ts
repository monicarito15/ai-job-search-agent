import Anthropic from "@anthropic-ai/sdk";
import { readCV } from "./tools/cv.js";
import { searchJobs } from "./tools/search.js";
import { scrapeJob } from "./tools/scraper.js";
import { researchCompany } from "./tools/company.js";
import { generateSoknad } from "./tools/documents.js";

const tools: Anthropic.Tool[] = [
  {
    name: "read_cv",
    description: "Read the user's CV to understand their skills and experience before searching for jobs.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "search_jobs",
    description: "Search for job postings on Norwegian job sites (finn.no, linkedin.com, karriere.no, nav.no).",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query, e.g. 'React developer Trondheim'" },
      },
      required: ["query"],
    },
  },
  {
    name: "scrape_job",
    description: "Read the full content of a job posting from a URL.",
    input_schema: {
      type: "object",
      properties: {
        url: { type: "string", description: "URL of the job posting" },
      },
      required: ["url"],
    },
  },
  {
    name: "research_company",
    description: "Research a company to understand their culture, tech stack and values.",
    input_schema: {
      type: "object",
      properties: {
        company_name: { type: "string", description: "Name of the company" },
      },
      required: ["company_name"],
    },
  },
  {
    name: "generate_soknad",
    description: "Generate and save a personalized søknad (.docx) for a job.",
    input_schema: {
      type: "object",
      properties: {
        company_name: { type: "string", description: "Name of the company" },
        content: { type: "string", description: "The full søknad text in Norwegian, in paragraphs separated by double newlines." },
      },
      required: ["company_name", "content"],
    },
  },
];

async function processToolCall(toolName: string, toolInput: Record<string, string>): Promise<string> {
  switch (toolName) {
    case "read_cv":
      console.log("📄 Reading CV...");
      return await readCV();
    case "search_jobs":
      console.log(`🔎 Searching: ${toolInput.query}`);
      return await searchJobs(toolInput.query);
    case "scrape_job":
      console.log(`🌐 Reading job posting: ${toolInput.url}`);
      return await scrapeJob(toolInput.url);
    case "research_company":
      console.log(`🏢 Researching company: ${toolInput.company_name}`);
      return await researchCompany(toolInput.company_name);
    case "generate_soknad":
      console.log(`✍️  Generating søknad for ${toolInput.company_name}...`);
      return await generateSoknad(toolInput.company_name, toolInput.content);
    default:
      return `Unknown tool: ${toolName}`;
  }
}

export async function runAgent(userQuery: string): Promise<void> {
  const client = new Anthropic();
  console.log(`\n🚀 Starting job search: "${userQuery}"\n`);

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userQuery },
  ];

  const system = `You are an AI job search agent helping a developer find relevant jobs in Norway.

Your process:
1. Always start by reading the CV to understand the candidate's skills
2. Search for jobs based on the query
3. For each search result that looks relevant: scrape the full job posting
4. Research the company behind each interesting posting
5. For each job that is a good match with the CV: generate a personalized søknad

Rules for writing søknader:
- Write in Norwegian
- Focus on what the candidate can do FOR the company, not what they want
- Never use em dashes (—) or bullet point lists (-) in søknader
- Never use colons (:) in søknader body text
- Write naturally, not like AI
- Structure: hook intro → technical skills with concrete examples → unique background → closing focused on company value
- Max 1 page

After finishing, print a summary with: job title, company, URL, match assessment, and whether a søknad was generated.`;

  while (true) {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8096,
      system,
      tools,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "end_turn") {
      const finalText = response.content
        .filter((b) => b.type === "text")
        .map((b) => (b as Anthropic.TextBlock).text)
        .join("\n");
      console.log("\n" + finalText);
      break;
    }

    if (response.stop_reason === "tool_use") {
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type === "tool_use") {
          const result = await processToolCall(block.name, block.input as Record<string, string>);
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result,
          });
        }
      }

      messages.push({ role: "user", content: toolResults });
    }
  }
}
