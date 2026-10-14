import dotenv from "dotenv";
import { runAgent } from "./agent.js";

dotenv.config();

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY in .env");
  process.exit(1);
}

if (!process.env.BRAVE_API_KEY) {
  console.error("Missing BRAVE_API_KEY in .env");
  process.exit(1);
}

const query = process.argv.slice(2).join(" ") || "find fullstack developer jobs in Trondheim Norway";

runAgent(query).catch((err) => {
  console.error("Agent failed:", err);
  process.exit(1);
});
