# Looking for Work — Agent Plan

## Stack
- TypeScript + Node.js
- Anthropic SDK (Claude as the brain)
- Brave Search API (search the internet)
- docx (generate .docx files)

## Step 1 — Tools

- [ ] `src/tools/cv.ts` — reads your CV from cv.md
- [ ] `src/tools/search.ts` — searches for jobs on finn.no, LinkedIn, karriere.no
- [ ] `src/tools/scraper.ts` — reads the content of each job posting
- [ ] `src/tools/company.ts` — researches the company online
- [ ] `src/tools/documents.ts` — generates the søknad .docx file

## Step 2 — Agent

- [ ] `src/agent.ts` — the loop that connects all tools with Claude

## Step 3 — CLI

- [ ] `src/index.ts` — what you type in the terminal to use the agent

## Step 4 — Output

- [ ] Rapport in markdown with the best jobs found
- [ ] Søknad ready as .docx saved in Documents/Cv og søknad/

---

## Full flow

```
you type: "find React jobs in Trondheim"
        ↓
search.ts searches finn.no / LinkedIn / karriere.no
        ↓
scraper.ts reads each job posting
        ↓
company.ts researches each company
        ↓
cv.ts reads your CV and compares
        ↓
Claude analyzes the match
        ↓
documents.ts generates the .docx
        ↓
saved to your Documents folder
```
