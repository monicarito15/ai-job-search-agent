import fs from "fs";
import path from "path";
import os from "os";

const HISTORY_FILE = path.join(os.homedir(), ".soknad-agent-history.json");

export interface Session {
  timestamp: string;
  query: string;
  summary: string;
}

export function loadHistory(): Session[] {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function saveSession(query: string, summary: string): void {
  const history = loadHistory();
  history.push({ timestamp: new Date().toISOString(), query, summary });
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

export function clearHistory(): void {
  if (fs.existsSync(HISTORY_FILE)) {
    fs.unlinkSync(HISTORY_FILE);
    console.log("🗑️  Historial borrado.");
  } else {
    console.log("No hay historial guardado.");
  }
}

export function formatHistoryForContext(history: Session[]): string {
  if (history.length === 0) return "";
  return history
    .map((s, i) => {
      const date = s.timestamp.split("T")[0];
      return `[Sesión ${i + 1} - ${date}]\nQuery: "${s.query}"\n${s.summary}`;
    })
    .join("\n\n---\n\n");
}
