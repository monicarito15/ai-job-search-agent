import dotenv from "dotenv";
import { runAgent } from "./agent.js";
import { clearHistory } from "./tools/history.js";

dotenv.config();

const args = process.argv.slice(2);

if (args[0] === "--clear") {
  clearHistory();
  process.exit(0);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY in .env");
  process.exit(1);
}

if (!process.env.BRAVE_API_KEY) {
  console.error("Missing BRAVE_API_KEY in .env");
  process.exit(1);
}

const query = args.join(" ") || "find fullstack developer jobs in Trondheim Norway";

runAgent(query).catch((err) => {
  console.error("Agent failed:", err);
  process.exit(1);
});
