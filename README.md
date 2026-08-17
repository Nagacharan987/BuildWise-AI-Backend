# BuildWise AI Backend

Secure server-side API for the BuildWise AI construction assistant.

## Architecture

BuildWise website -> POST /api/ask -> secure backend -> AI model -> answer

## Run locally

Install Node.js, then:

```bash
npm install
```

Copy `.env.example` to `.env` and add your real API key:

```text
OPENAI_API_KEY=your_real_key_here
```

Start:

```bash
npm start
```

Health check:

```text
http://localhost:3000/api/health
```

## Security

`.env` is ignored by Git. Never commit a real API key. The browser must call this backend rather than the AI provider directly.

## API

POST `/api/ask`

```json
{
  "question": "I have a 1200 sq.ft plot and want a 3-bedroom G+1 house. What should I plan first?"
}
```
