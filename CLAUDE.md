# AI Job Search Agent

## What this project does
An AI agent that searches for jobs on finn.no, LinkedIn and karriere.no, researches each company, compares with the user's CV, and generates a personalized søknad (.docx) for each job.

## Stack
- TypeScript + Node.js
- Anthropic SDK (Claude as the brain)
- Brave Search API (search the internet)
- docx npm package (generate .docx files)

## Project structure
```
src/
├── index.ts          # CLI entry point
├── agent.ts          # agent loop
└── tools/
    ├── cv.ts         # reads cv.md
    ├── search.ts     # searches finn.no / LinkedIn / karriere.no
    ├── scraper.ts    # reads each job posting
    ├── company.ts    # researches the company
    └── documents.ts  # generates søknad .docx
cv.md                 # User's CV in text format (not included in repo — add your own)
```

## Environment variables
- `ANTHROPIC_API_KEY` — Anthropic API key
- `BRAVE_API_KEY` — Brave Search API key

## Output
- Rapport in markdown with best matching jobs
- Søknad as .docx saved to ~/Documents/

## Søknad format
The generated .docx must follow this format:
1. Header: bold name, contact info in dark gray (#595959)
2. Date: "Trondheim, [day]. [month] [year]"
3. "Til [company]" — bold
4. Body paragraphs: justified alignment
5. Closing: "Med vennlig hilsen" + bold name
- Never use em dash (—) in søknader
