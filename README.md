# Looking for Work

AI agent that searches for jobs in Norway, researches companies, and generates personalized søknader automatically.

## What it does

1. Searches for jobs on finn.no, LinkedIn and karriere.no
2. Reads each job posting
3. Researches the company
4. Compares with your CV
5. Generates a ready-to-send søknad (.docx)

## Requirements

- Node.js
- Anthropic API key
- Brave Search API key (free at brave.com/search/api)

## Setup

```bash
npm install
cp .env.example .env
# Add your API keys to .env
```

## Usage

```bash
npm start "find React jobs in Trondheim"
```

## Output

- Rapport with best matching jobs
- Søknad .docx saved to your Documents folder
