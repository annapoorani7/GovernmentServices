# Sahaayak AI (Frontend)

React + Vite SPA for **Sahaayak AI**, an AI-powered navigation assistant for official Indian government services.

## Stack
- **React 18** (functional components + Hooks)
- **Vite 5** (dev server on port 3000, proxies `/api` → `http://localhost:5000`)
- **Axios** for API calls
- Pure CSS with a minimalist white, slate, and neutral palette (no CSS framework)

## Run

```bash
# 1. Start the backend first (from /server)
cd ../server && npm install && node seed.js && npm run dev

# 2. Start the frontend
cd ../citizen-portal
npm install
npm run dev          # → http://localhost:3000
```

## Features
- Sahaayak AI assistant at `/ai-assistant`
- Grounded recommendations with action plans and follow-up questions
- Debounced search across service names + keywords
- Category sidebar filter
- Scannable service cards with essential processing, cost, document, and delivery details
- Official portal links that open in a new tab
- Skeleton loading states
- Responsive layout with keyboard-accessible controls

## Structure
```
citizen-portal/
├── index.html
├── vite.config.js          # /api proxy → backend
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx             # State + data fetching
    ├── api/api.js          # Axios wrapper
    ├── index.css           # Minimalist responsive styles
    └── components/
        ├── common/         # Header, footer, loading, and error states
        ├── categories/     # Category cards and sidebar
        └── services/       # Search, metadata, cards, list, and pagination
```
