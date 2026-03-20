# Macro - AI Assistant

> A ChatGPT-style assistant focused on interactive chat, file uploads, and optional web search.

## Features

- **Chat with AI** - Powered by any OpenAI-compatible API (GPT-4o-mini by default)
- **File uploads** - Attach PDF, DOCX, or TXT files; their content is included in the AI context
- **Web search toggle** - Per-message toggle to include web search results in the AI prompt
- **Conversation persistence** - All chats stored in MongoDB
- **Landing page** - Robot illustration + hero section with brand identity
- **Responsive UI** - Tailwind CSS dark theme, works on mobile and desktop

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express, ES Modules |
| Database | MongoDB (Mongoose) |
| AI | OpenAI-compatible Chat Completions API |
| File upload | multer |
| HTTP client | axios |

## Project Structure

```
macro/
  backend/
    src/
      config/       # env.js, db.js
      models/       # Conversation, Message, File
      routes/       # chatRoutes, uploadRoutes, conversationRoutes
      services/     # aiService, webSearchService, fileService, conversationService
      middleware/   # errorHandler
      utils/        # promptBuilder
      server.js     # Express entry point
    uploads/        # uploaded files (gitignored)
    package.json
  frontend/
    src/
      routes/       # Landing.jsx, Chat.jsx
      App.jsx
      main.jsx
      index.css
    index.html
    vite.config.js
    tailwind.config.cjs
    postcss.config.cjs
    package.json
  .env.example
  .gitignore
  package.json      # root scripts (dev, install-all)
  README.md
```

## Quick Start (Local)

### 1. Clone and configure environment

```bash
git clone https://github.com/dileepsurya101/macro.git
cd macro
cp .env.example .env
```

Edit `.env` and fill in your values:

```bash
# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/macro   # or MongoDB Atlas URI
OPENAI_API_KEY=sk-...
OPENAI_API_BASE_URL=https://api.openai.com/v1
CLIENT_ORIGIN=http://localhost:5173

# Frontend
VITE_API_BASE_URL=http://localhost:5000
```

> Tip: If using the Vite dev proxy (default), you can leave VITE_API_BASE_URL empty and API calls will proxy to localhost:5000 automatically.

### 2. Install dependencies

```bash
npm run install-all
```

This installs packages in both `backend/` and `frontend/`.

### 3. Create the uploads folder

```bash
mkdir -p backend/uploads
```

### 4. Start dev servers

```bash
npm run dev
```

This runs both servers concurrently:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

Open http://localhost:5173 in your browser.

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| POST | /api/chat | Send message, get AI reply |
| POST | /api/upload | Upload files (PDF/DOCX/TXT) |
| GET | /api/conversations | List conversations |
| GET | /api/conversations/:id | Get conversation + messages + files |

### POST /api/chat body

```json
{
  "conversationId": "<optional, null for new>",
  "message": "Your question here",
  "fileIds": ["<optional file ids>"],
  "useWebSearch": false
}
```

## Deployment

### Frontend (Vercel / Netlify)

1. Set root to `frontend/`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variable: `VITE_API_BASE_URL=https://your-backend.render.com`

### Backend (Render / Railway / Fly.io)

1. Set root to `backend/`
2. Start command: `npm start`
3. Set all environment variables from `.env.example`
4. Use MongoDB Atlas for `MONGODB_URI`

## Extending Macro

### Real web search

Open `backend/src/services/webSearchService.js` and replace the mock with your preferred API:
- [SerpAPI](https://serpapi.com/)
- [Brave Search API](https://api.search.brave.com/)
- [Tavily](https://docs.tavily.com/)

### PDF / DOCX text extraction

Open `backend/src/services/fileService.js` and follow the TODO comments to add:
- `pdf-parse` for PDF
- `mammoth` for DOCX

### Authentication

The User model and auth middleware stubs are documented in `backend/src/` — add JWT-based email/password auth by implementing `authRoutes.js` and `authMiddleware.js`.

## License

MIT
