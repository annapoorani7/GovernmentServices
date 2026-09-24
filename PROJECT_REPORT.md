## 1. PROJECT OVERVIEW

### 1.1 Project name
The project is Sahaayak AI, implemented as a government-services finder and conversational assistant. The codebase contains a React frontend in citizen-portal and an Express + MongoDB backend in server.

### 1.2 Purpose
The application aims to help citizens find the correct government service for a problem they describe in natural language, understand which documents or service fits their need, and be directed back to the official government portal.

This is not a generic chatbot. The repo contains a structured service catalog and a retrieval-first assistant that tries to answer only using verified service records and official URLs from the directory.

### 1.3 Problem being solved
The code and README indicate that Indian government services are spread across many different departmental websites, and citizens may know the problem but not the service name, department, or official portal.

The project tries to solve:
- natural-language discovery of government services;
- association of a user’s issue with one or more relevant service records;
- recommendation of official government links;
- conversational follow-up support like “What documents do I need?” based on the retrieved service context.

### 1.4 Target users
The primary target users are Indian citizens looking for official digital government services. The UI contains multilingual support in the data model and translations; the actual frontend supports multiple languages in its localization layer.

The code indicates the product is citizen-facing rather than an internal admin tool, although some CRUD endpoints for categories and services are present in the backend.

### 1.5 Main features
Verified from code:
- React app with service browsing, category filtering, pagination, search, and details pages;
- AI assistant page at /ai-assistant;
- retrieval of relevant services before generating an answer;
- recommendation cards with official portal links;
- follow-up suggestions and conversation memory;
- document readiness wizard for required documents;
- multilingual localization support in the data model and frontend translation dictionary;
- Express + Mongoose API with category and service endpoints;
- grounded fallback when AI credentials are missing or AI fails.

### 1.6 What makes this an AI project
This project is AI-backed because:
- the backend calls a provider based on AI_PROVIDER;
- the assistant uses a selected government service context to construct provider input;
- the backend calls OpenAI Responses API or Hugging Face-compatible OpenAI client endpoints;
- retrieval is performed before generating an answer;
- the AI response includes natural-language responses and follow-up suggestions.

This is a retrieval-augmented assistant, not an autonomous agent. It does not implement autonomous workflows, agent memory beyond a bounded session store, or task execution.

### 1.7 What makes it suitable for Razorpay Open Track
It is relevant to Razorpay Open Track because it combines:
- product thinking around a citizen service discovery problem;
- backend + frontend architecture;
- AI application design with retrieval and grounding;
- use of external APIs and environment-configured model selection;
- focus on reliability, explicit ground rules, and fallback behavior;
- business use of official government links and service metadata.

It is a realistic AI product prototype with actual implementation, not just a demo landing page.

### 1.8 Implemented vs planned/documented
Implemented and verified:
- frontend with Vite + React + React Router;
- Express API; MongoDB with Mongoose;
- service catalog and category models;
- retrieval ranking logic; in-memory conversation memory; AI assistant route;
- OpenAI and Hugging Face provider paths;
- fallback answer engine;
- localization/dynamic translations.

Only partially implemented or not fully verified as production-grade:
- authentication/authorization: not implemented;
- rate limiting: not implemented;
- vector search / embeddings: not implemented;
- robust production observability: not implemented;
- real-time data syncing with government portals: not implemented;
- full multilingual AI generation pipeline: there are translation scripts but not necessarily used at runtime for assistant responses.

The README describes a polished product story; the code itself is smaller and more conservative. For interview preparation, the strongest truthful story is: “This is a grounded government-services assistant built around a verified service directory with lexical retrieval and a bounded AI layer.”

---

## 2. COMPLETE PROJECT STRUCTURE

### 2.1 Actual folder tree

```text
GovernmentServices-main/
├─ README.md
├─ PROJECT_REPORT.md
├─ RAZORPAY_INTERVIEW_PROJECT_AUDIT.md
├─ citizen-portal/
│  ├─ index.html
│  ├─ package.json
│  ├─ README.md
│  ├─ vite.config.js
│  ├─ public/
│  │  ├─ manifest.webmanifest
│  │  └─ sw.js
│  └─ src/
│     ├─ App.jsx
│     ├─ index.css
│     ├─ main.jsx
│     ├─ api/
│     │  └─ api.js
│     ├─ components/
│     │  ├─ categories/
│     │  │  ├─ CategoryCard.jsx
│     │  │  └─ CategorySidebar.jsx
│     │  ├─ common/
│     │  │  ├─ AshokaChakra.jsx
│     │  │  ├─ EmptyState.jsx
│     │  │  ├─ ErrorMessage.jsx
│     │  │  ├─ Footer.jsx
│     │  │  ├─ Header.jsx
│     │  │  ├─ LifeEventIcon.jsx
│     │  │  └─ Loading.jsx
│     │  └─ services/
│     │     ├─ DocumentReadinessWizard.jsx
│     │     ├─ Pagination.jsx
│     │     ├─ SearchBar.jsx
│     │     ├─ ServiceCard.jsx
│     │     ├─ ServiceList.jsx
│     │     └─ ServiceMetadata.jsx
│     ├─ data/
│     │  ├─ eligibilityQuestions.js
│     │  └─ lifeEvents.js
│     ├─ hooks/
│     │  ├─ useCategories.js
│     │  ├─ useServices.js
│     │  └─ useVoice.js
│     ├─ i18n/
│     │  ├─ LanguageContext.jsx
│     │  └─ translations.js
│     ├─ pages/
│     │  ├─ AIAssistant.jsx
│     │  ├─ Eligibility.jsx
│     │  ├─ Home.jsx
│     │  ├─ LifeEvents.jsx
│     │  ├─ NotFound.jsx
│     │  ├─ ServiceDetails.jsx
│     │  └─ Services.jsx
│     ├─ routes/
│     │  └─ AppRoutes.jsx
│     └─ utils/
│        └─ searchSynonyms.js
├─ server/
│  ├─ .env
│  ├─ .gitignore
│  ├─ package.json
│  ├─ package-lock.json
│  ├─ server.js
│  ├─ config/
│  │  └─ db.js
│  ├─ controllers/
│  │  ├─ aiController.js
│  │  ├─ categoryController.js
│  │  ├─ healthController.js
│  │  └─ serviceController.js
│  ├─ middleware/
│  │  ├─ asyncHandler.js
│  │  ├─ errorHandler.js
│  │  └─ notFound.js
│  ├─ models/
│  │  ├─ Category.js
│  │  └─ Service.js
│  ├─ providers/
│  │  └─ huggingface.js
│  ├─ routes/
│  │  ├─ aiRoutes.js
│  │  ├─ categoryRoutes.js
│  │  ├─ healthRoutes.js
│  │  └─ serviceRoutes.js
│  ├─ scripts/
│  │  ├─ fix-category-refs.js
│  │  ├─ seed.js
│  │  ├─ test-conversation.js
│  │  ├─ test-retrieval.js
│  │  ├─ verify-integrity.js
│  │  └─ i18n/
│  │     ├─ README.md
│  │     ├─ bhashiniClient.js
│  │     ├─ generate-translations.js
│  │     ├─ languages.js
│  │     ├─ merge-translations.js
│  │     └─ sources/
│  │        ├─ contentSource.js
│  │        ├─ englishContent.js
│  │        └─ uiSource.js
│  ├─ services/
│  │  ├─ aiService.js
│  │  ├─ categoryService.js
│  │  ├─ conversationService.js
│  │  ├─ retrievalService.js
│  │  └─ serviceService.js
│  └─ utils/
│     ├─ apiResponse.js
│     └─ sanitizeRegex.js
```

### 2.2 Purpose of important folders

#### citizen-portal/src
This is the React front-end. It contains app entry, routes, pages, components, hooks, API wrapper, and localization logic.

Important files:
- App.jsx: app shell and language/provider setup;
- routes/AppRoutes.jsx: route declarations;
- pages/AIAssistant.jsx: assistant UI and message flow;
- hooks/useServices.js: service search and fetch behavior;
- hooks/useVoice.js: Speech recognition and speech synthesis;
- api/api.js: all backend API calls;
- i18n/LanguageContext.jsx: multi-language translation support.

#### server
This is the backend API and AI layer. It contains the Express server, routing, controllers, models, services, and scripts.

Important files:
- server.js: server bootstrap;
- config/db.js: MongoDB connection;
- routes/*.js: API boundary;
- controllers/*.js: HTTP handlers;
- services/*.js: retrieval, AI, conversation, business logic;
- models/*.js: schemas.

#### controllers
Responsible for request validation, orchestration, and response shaping. They call service functions and return JSON responses.

Important files:
- aiController.js: validates user input and delegates retrieval + AI generation;
- serviceController.js: CRUD operations for services;
- categoryController.js: CRUD operations for categories;
- healthController.js: health status response including MongoDB connection state.

#### services
This contains the real business logic. It is the central layer between controllers and models/providers.

Important files:
- retrievalService.js: lexical retrieval and scoring logic;
- aiService.js: provider selection, prompt construction, provider calls, fallback decisions;
- conversationService.js: in-memory session history retention;
- serviceService.js: service query, filtering, pagination, update, delete operations;
- categoryService.js: category CRUD with deletion protection.

#### models
MongoDB data schema definitions.

Important files:
- Service.js: service catalog schema with category relations, localized fields, document arrays, etc.;
- Category.js: category list model with unique name field.

#### routes
Express route declarations.

Important files:
- aiRoutes.js: POST /assist;
- serviceRoutes.js: GET/POST/PUT/DELETE for services;
- categoryRoutes.js: GET/POST/PUT/DELETE for categories;
- healthRoutes.js: GET /health.

#### middleware
Cross-cutting request handling.

Important files:
- asyncHandler.js: catches async errors and calls next(error);
- errorHandler.js: centralized exception formatting;
- notFound.js: 404 route handler.

#### AI-related files
- providers/huggingface.js: Hugging Face OpenAI-compatible call wrapper;
- services/aiService.js: main AI orchestration and grounding logic;
- services/retrievalService.js: search + ranking; important for RAG;
- services/conversationService.js: bounded recent conversation memory.

### 2.3 Important source files and responsibilities

#### citizen-portal/src/api/api.js
Responsibility: central Axios API wrapper. Calls /api/* endpoints.
Communicates with: backend Express API under /api.
Important functions:
- getCategories
- getServices
- getServiceById
- assistWithAI
- createService/updateService/deleteService
- updateCategory/deleteCategory

#### citizen-portal/src/pages/AIAssistant.jsx
Responsibility: chat interface for the AI assistant and user interaction logic.
Communicates with: assistWithAI in api.js and backend /api/ai/assist.
Important functions:
- createSessionId
- RecommendedServices
- renderInline
- FormattedAnswer
- AssistantMessage
- AIAssistant
Key behavior: sends message, sets loading, calls assistWithAI, renders final response, follow-up suggestions, and recommended service cards.

#### citizen-portal/src/hooks/useServices.js
Responsibility: fetches services and search results, manages category filters and pagination.
Communicates with: api.getServices.
Important functions:
- useServices
- handleSelectCat
- handleSearchChange

#### citizen-portal/src/utils/searchSynonyms.js
Responsibility: lightweight query expansion for lexical search. This is not a vector database, but a synonym expansion layer before sending a search query to the backend.
Communicates with: useServices -> getServices.
Important function: expandQuery(raw).

#### server/server.js
Responsibility: server bootstrap, security middleware, route mounting, 404 handling, and error handler registration.
Communicates with: routes and middleware.
Important setup: helmet(), cors(), express.json(), app.use("/api/..."), notFound, errorHandler.

#### server/controllers/aiController.js
Responsibility: entry point for /api/ai/assist.
Communicates with: retrievalService.js and aiService.js.
Important logic:
- validates message length and sessionId format;
- chooses retrieval query based on explicit service-topic detection or conversation history;
- calls retrieveRelevantServices();
- calls assistWithServices();
- appends user + assistant messages into conversation history.

#### server/services/aiService.js
Responsibility: AI provider selection, prompt construction, provider invocation, and grounded fallback.
Communicates with: providers/huggingface.js and OpenAI SDK.
Important functions:
- buildFallback
- serviceContext
- toPublicService
- assistWithServices
- buildOpenAIInput

#### server/services/retrievalService.js
Responsibility: lexical retrieval and ranking engine.
Communicates with: Service model.
Important functions:
- tokenize
- expandAliases
- extractPhrases
- scoreService
- retrieveRelevantServices

#### server/services/conversationService.js
Responsibility: in-memory bounded session memory.
Communicates with: aiController.js.
Important functions:
- getConversation
- appendConversation

#### server/models/Service.js
Responsibility: schema for government service catalog.
Communicates with: retrievalService.js, serviceService.js, seed.js, scripts.
Important fields include name, description, officialLink, category, keywords, eligibilitySummary, requiredDocuments, commonUseCases, localized variants.

#### server/models/Category.js
Responsibility: schema for article/service categories.
Communicates with: service model and category CRUD logic.

#### server/routes/serviceRoutes.js
Responsibility: defines CRUD API routes for service records.
Communicates with: serviceController.js.

#### server/routes/categoryRoutes.js
Responsibility: defines CRUD API routes for category records.
Communicates with: categoryController.js.

#### server/services/serviceService.js
Responsibility: query logic and CRUD business rules for services.
Communicates with: Service model and Category model.
Important functions:
- getServices
- getServiceById
- createService
- updateService
- deleteService

#### server/services/categoryService.js
Responsibility: CRUD rules for category operations.
Communicates with: Category model and Service model.
Important rule: prevents deleting a category if associated services still reference it.

#### server/providers/huggingface.js
Responsibility: wrapper around an OpenAI-compatible HF endpoint.
Communicates with: aiService.js.
Important function: callHuggingFace(message, context).

#### server/middleware/errorHandler.js
Responsibility: centralized exception formatting for validation, cast, duplicate-key, custom app errors.
Communicates with: all routes using asyncHandler.

---

## 3. TECHNOLOGY STACK

| Technology | Where Used | Why It Is Used | Verified From Code? |
| --- | --- | --- | --- |
| React | citizen-portal/package.json and JSX files | UI rendering and routing | Yes |
| Vite | citizen-portal/package.json, vite.config.js | frontend build/dev server | Yes |
| React Router | package.json + AppRoutes.jsx | URL-based navigation | Yes |
| Axios | citizen-portal/src/api/api.js | HTTP client for browser API calls | Yes |
| Express | server/package.json + server.js | backend framework | Yes |
| Node.js runtime | server/package.json (scripts: node, nodemon) | backend execution environment | Yes |
| MongoDB | config/db.js + models/*.js | persistence for government services and categories | Yes |
| Mongoose | server/package.json and models | ODM for schema + queries | Yes |
| OpenAI SDK | server/package.json + aiService.js + providers/huggingface.js | AI provider integration | Yes |
| Hugging Face OpenAI-compatible endpoint | providers/huggingface.js + AI_PROVIDER handling | alternative AI provider | Yes |
| AI model | aiService.js and .env names | model selection via OPENAI_MODEL and HF_MODEL | Yes |
| CORS | server.js | cross-origin access during local dev | Yes |
| Helmet | server.js | HTTP security headers | Yes |
| dotenv | server/server.js + scripts | environment variable loading | Yes |
| MongoDB local connection | config/db.js | connection to database | Yes |
| JavaScript/ES modules | package.json type=module and imports | modern module system | Yes |
| CSS/vanilla styling | index.css and component classNames | frontend styling | Yes |
| Speech recognition / TTS | useVoice.js | optional voice input/output | Yes |
| Localization/translations | LanguageContext.jsx + translations.js | multi-language UI | Yes |
| Node-fetch | server/package.json (node-fetch) | some scripts may use fetch-like behavior; not central to runtime | Yes |
| Authentication | NOT IMPLEMENTED | no auth middleware or token validation found | Yes, no implementation |
| Rate limiting | NOT IMPLEMENTED | no express-rate-limit or equivalent found | Yes, no implementation |
| Testing tools | server/scripts/test-*.js + Node assert | lightweight verification scripts | Yes |
| ORM/ODM beyond Mongoose | none found | not used | Yes |
| SQL DB | not used | not present | Yes |
| Redis / queue / cache | not found | not implemented | Yes |

### Verified dependencies from actual package manifests
- Frontend dependencies: react, react-dom, react-router-dom, axios, Vite, @vitejs/plugin-react
- Backend dependencies: express, mongoose, cors, dotenv, helmet, openai, node-fetch
- No authentication library, no validator library, no rate-limiter library, no websockets, no socket.io, no Redux, no Zustand, no TypeScript, no Prisma, no pg, no Sequelize.

---

## 4. FRONTEND ARCHITECTURE

### 4.1 Application entry point
The app boots in citizen-portal/src/main.jsx.

Flow:
- ReactDOM.createRoot attaches the app to the root DOM element.
- App.jsx renders LanguageProvider and BrowserRouter.
- App includes Header, main content area, and Footer.
- The app registers a service worker only when running in production build mode and navigator.serviceWorker exists.

Important file:
- citizen-portal/src/main.jsx
- citizen-portal/src/App.jsx

### 4.2 Routing
Routing is defined in citizen-portal/src/routes/AppRoutes.jsx.

Routes:
- / -> Home
- /services -> Services
- /services/:id -> ServiceDetails
- /ai-assistant -> AIAssistant
- /eligibility -> Eligibility
- /life-events -> LifeEvents
- /scam-shield -> ScamShield
- * -> NotFound

This is a standard client-side React Router app.

### 4.3 Main pages
- Home.jsx: landing page with call-to-action and navigation links.
- Services.jsx: search + category browsing screen with pagination.
- ServiceDetails.jsx: individual service detail page with official portal and document readiness wizard.
- AIAssistant.jsx: chat UI for assistant interactions.
- Eligibility.jsx: likely eligibility flow; actual specifics not fully examined in this audit but file is present.
- LifeEvents.jsx: life-event-based discovery.
- ScamShield.jsx: scam-related guidance UI.

### 4.4 Components
Representative files:
- common/Header.jsx and Footer.jsx: global navigation/footer.
- categories/CategorySidebar.jsx and CategoryCard.jsx: category filtering UI.
- services/SearchBar.jsx: search form.
- services/ServiceList.jsx: list of service cards.
- services/ServiceCard.jsx: individual service preview card.
- services/ServiceMetadata.jsx: metadata rows like processing time, fees, documents, delivery mode.
- services/DocumentReadinessWizard.jsx: interactive checklist saved per service in localStorage.
- common/ErrorMessage.jsx and Loading.jsx: UI state patterns.

### 4.5 API service layer
The browser calls backend endpoints through citizen-portal/src/api/api.js.

This file provides:
- getCategories()
- getServices({ category, search, page, limit })
- getServiceById(id)
- assistWithAI(message, sessionId)
- CRUD wrappers for service/category management

All requests are against /api, relying on the Vite proxy configuration to route to the backend server.

### 4.6 State management
The frontend uses React local state and custom hooks. It does not use Redux, Zustand, or a centralized store.

Examples:
- useServices.js manages service list, search, filters, pagination, loading, and error.
- useCategories.js fetches categories.
- useVoice.js manages voice state.
- AIAssistant.jsx manages chat messages, loading, and error state.
- LanguageContext manages active language and translation helpers.

### 4.7 How forms/user actions work
Examples:
- SearchBar changes search text and triggers useServices state updates.
- CategorySidebar selects a category and calls setSelectedCat.
- ServiceDetails uses useParams to load a specific service by ID.
- AIAssistant form uses textarea with onSubmit=sendMessage.
- The assistant can also run through starter prompts or microphone input.

### 4.8 How loading states work
Typical pattern:
- setLoading(true) before request;
- render a spinner/placeholder or disabled submit button;
- setLoading(false) in finally.

Examples:
- AIAssistant.jsx: loading state disables input and shows animated “thinking” status.
- ServiceDetails.jsx: loading skeleton card while fetching details.
- Services.jsx: loading text in the count area and passes loading to Pagination and ServiceList.

### 4.9 How errors are handled
Frontend error handling is simple and local:
- catch blocks set error states;
- ErrorMessage component displays them;
- AIAssistant.jsx surfaces requestError.response?.data?.message or generic message.
- ServiceDetails.jsx shows a user-facing error card with a Back to Services button.
- useServices and useCategories set error text when API calls fail.

There is no global error boundary in the React app. We do not see React ErrorBoundary usage.

### 4.10 How AI responses are displayed
In AIAssistant.jsx:
- The response object is stored as assistant message content: { role: "assistant", response }.
- AssistantMessage receives response.
- FormattedAnswer maps the answer string into formatted chunks:
  - headings (#)
  - numbered lists
  - bullet lists
  - inline markdown-like bold or external links
- Follow-up suggestions render as buttons.
- RecommendedServices renders a recommendation card list if response.recommendedServices exists.
- Each service card includes:
  - category
  - name
  - description
  - ServiceMetadata
  - whyFits reason
  - Details link
  - official portal link

### 4.11 How official government links are displayed
The backend returns officialLink values in the service data. The UI displays them in multiple places:
- RecommendedServices card with official portal link.
- ServiceDetails page with large official portal button.
- DocumentReadinessWizard action button when ready.
- The frontend uses rel="noopener noreferrer" and target="_blank" for external links.

### 4.12 AI assistant frontend flow (exact flow)
User types message
→ citizen-portal/src/pages/AIAssistant.jsx sendMessage() function
→ trimmed message validation
→ assistWithAI(trimmed, sessionId) from citizen-portal/src/api/api.js
→ axios POST /api/ai/assist
→ Express route in server/routes/aiRoutes.js -> assist in server/controllers/aiController.js
→ aiController.js calls retrieveRelevantServices(retrievalQuery, 3)
→ server/services/retrievalService.js searches MongoDB services
→ aiController.js calls assistWithServices(message, services, history)
→ server/services/aiService.js chooses provider and calls OpenAI or Hugging Face
→ result is returned to frontend
→ AIAssistant.jsx setMessages(... assistant response ...)
→ AssistantMessage renders FormattedAnswer, suggestions, recommendedServices
→ user sees final answer and recommended links

### 4.13 Voice features
The app supports optional Web Speech API for speech input / output via useVoice.js.
- Recognizes using window.SpeechRecognition or webkitSpeechRecognition.
- Reads answers via speechSynthesis.
- Buttons are hidden if unsupported.

This is real functionality but optional, not required to use the AI assistant.

---

## 5. BACKEND ARCHITECTURE

### 5.1 Server entry point
Server entry: server/server.js

This file:
- loads env using dotenv;
- calls connectDB();
- creates Express app;
- applies helmet and cors;
- applies express.json();
- mounts routes:
  - /api/health
  - /api/categories
  - /api/services
  - /api/ai
- adds root route returning "Gov Services API Running";
- attaches notFound middleware;
- attaches centralized errorHandler;
- listens on PORT from environment or 5000.

### 5.2 Express setup
Verified setup from server.js:
- app.use(helmet());
- app.use(cors());
- app.use(express.json());

There is no rate limiter, request size limit, or auth middleware in the main app setup.

### 5.3 Middleware
- asyncHandler.js: wraps async functions and forwards errors.
- errorHandler.js: handles Mongoose validation, cast errors, duplicate key errors, and default internal errors.
- notFound.js: responds 404 for unknown routes.

### 5.4 Routes
- aiRoutes.js: POST /assist
- categoryRoutes.js: GET /, POST /, PUT /:id, DELETE /:id
- serviceRoutes.js: GET /, GET /:id, POST /, PUT /:id, DELETE /:id
- healthRoutes.js: GET /

### 5.5 Controllers
- aiController.js: orchestrates AI assistant request flow
- categoryController.js: category CRUD
- serviceController.js: service CRUD + query logic
- healthController.js: database connection health status

### 5.6 Services
- retrievalService.js: ranking logic
- aiService.js: provider calls and grounding
- serviceService.js: DB query and mutation logic
- categoryService.js: DB category validation and business rules
- conversationService.js: bounded conversation memory

### 5.7 Models
- Service.js
- Category.js

### 5.8 Error handling
The centralized error handler in server/middleware/errorHandler.js handles:
- CastError -> 400 invalid resource ID format
- Duplicate key errors (code 11000) -> 400
- ValidationError -> 400 with validation messages
- custom err.statusCode -> that status
- default -> 500 with message

It exposes stack traces in non-production mode only.

### 5.9 Validation
Validation is present in Mongoose model schemas and in a few custom controller checks.
Examples:
- Service.name required
- Service.description required
- Service.officialLink required and URL-matched by regex
- category required
- aiController.js: message required, max length 1000, sessionId regex validation

There is no extensive request-body validation library like Joi or Zod.

### 5.10 Security middleware
Implemented:
- helmet
- cors
- input trimming in AI controller
- sanitizeRegex used in service retrieval queries
- limited allowed fields in createService/updateService and createCategory/updateCategory

Not implemented:
- authentication
- authorization
- rate limiting
- CSRF protection for browser API endpoints
- request-body schema validation with a strong validator
- secrets management beyond .env files

### 5.11 API response structure
Common response style from the backend:

```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... },
  "message": "..."
}
```

For AI route:

```json
{
  "success": true,
  "data": {
    "answer": "...",
    "recommendedServices": [ ... ],
    "followUpSuggestions": [ ... ],
    "followUpQuestions": [ ... ],
    "actionPlan": [],
    "grounded": true,
    "provider": "openai",
    "sessionId": "..."
  }
}
```

### 5.12 Request flow diagram

```text
Client
→ Route (server/routes/*.js)
→ Middleware (helmet, cors, asyncHandler, notFound, errorHandler)
→ Controller (server/controllers/*.js)
→ Service (server/services/*.js)
→ Database/AI (MongoDB, OpenAI/Hugging Face)
→ Controller formats response
→ Client receives JSON or UI state update
```

---

## 6. API ENDPOINTS

| Method | Endpoint | Purpose | Controller | Authentication | Main Request Data | Main Response Data |
| --- | --- | --- | --- | --- | --- | --- |
| GET | /api/health | Health check + DB connectivity | healthController.js | None implemented | none | success, message, database |
| GET | /api/categories | List all categories | categoryController.js | None implemented | query params optional | array of categories |
| POST | /api/categories | Create category | categoryController.js | None implemented | { name, icon? } | created category |
| PUT | /api/categories/:id | Update category | categoryController.js | None implemented | { name?, icon? } | updated category |
| DELETE | /api/categories/:id | Delete category | categoryController.js | None implemented | id in path | success message |
| GET | /api/services | List/search services with pagination | serviceController.js | None implemented | category, search, page, limit | services array + pagination |
| GET | /api/services/:id | Get one service | serviceController.js | None implemented | id in path | service object |
| POST | /api/services | Create service | serviceController.js | None implemented | service payload | created service |
| PUT | /api/services/:id | Update service | serviceController.js | None implemented | allowed fields | updated service |
| DELETE | /api/services/:id | Delete service | serviceController.js | None implemented | id in path | success message |
| POST | /api/ai/assist | AI assistant request with retrieval and grounding | aiController.js | None implemented | { message, sessionId? } | answer, recommendedServices, followUpSuggestions, sessionId |
| GET | / | Root status | server.js inline | None | none | “Gov Services API Running” |
| ALL | unmatched routes | 404 response | notFound.js | None | any request | { success:false, message:"Route not found" } |

### Important notes
- There is no authentication endpoint in this repository.
- There is no login/logout or JWT implementation.
- /api/ai/assist is the critical route for the AI assistant.
- /api/services and /api/categories are the main data access APIs.

---

## 7. DATABASE / MONGODB

### 7.1 Models
#### Category model
File: server/models/Category.js

Schema fields:
- name: String, required, trimmed, unique
- icon: String, optional
- timestamps enabled

Purpose:
- stores high-level categories like Identity, Travel, Health, Finance, etc.

Notes:
- unique constraint on category name
- no soft-delete or timestamps beyond mongoose timestamps

#### Service model
File: server/models/Service.js

Schema fields:
- name: required String
- name_hi: optional String
- name_ta: optional String
- description: required String
- description_hi: optional String
- description_ta: optional String
- officialLink: required String with regex URL validation
- category: ObjectId reference to Category, required
- keywords: String array
- eligibilitySummary: String, default: "Check the official portal for current eligibility requirements."
- eligibilitySummary_hi: optional String
- eligibilitySummary_ta: optional String
- requiredDocuments: String array
- requiredDocuments_hi: String array
- requiredDocuments_ta: String array
- commonUseCases: String array
- commonUseCases_hi: String array
- commonUseCases_ta: String array
- timestamps enabled

Indexes:
- { category: 1 }
- { name: 1 }
- { keywords: 1 }

### 7.2 Relationships
The relationship is a classic MongoDB reference:
- Service.category -> Category._id
- This is populated via .populate("category", "name") in many queries.

### 7.3 What data is in the database
The seed script populates service records and categories for a public-service directory. The repo includes many service names like:
- Aadhaar (UIDAI)
- PAN Card (Income Tax)
- Voter ID (Election Commission)
- Passport Seva
- Visa & OCI Services
- Driving Licence (Parivahan)
- Vehicle Registration (VAHAN)
- FASTag
- Income Tax e-Filing
- GST Portal
- TRACES (TDS/TCS)
- PM Jan Dhan Yojana
- Digital India Land Records
- e-Stamping
- EPFO
- ESIC
- National Career Service
- CoWIN
- National Scholarship Portal
- One Nation One Ration Card
- Cyber Crime Reporting
- and more

The exact dataset shape is in server/scripts/seed.js.

### 7.4 How data is inserted
- Seed script: server/scripts/seed.js
- It connects to MongoDB using MONGO_URI and inserts category/service records.
- It creates categories and services with name, descriptions, localized fields, official URLs, keywords, and metadata.

### 7.5 How data is retrieved
- getServices in server/services/serviceService.js queries MongoDB with optional category filter and search tokens.
- It uses regex on multiple fields and sorts results by relevance.
- getServiceById finds by ID and populates category.
- retrievalService.js does separate retrieval for the AI assistant, not just the general browse API.

### 7.6 How data is updated/deleted
- createService/updateService/deleteService in serviceService.js
- categoryService.js has deletion protection so categories cannot be deleted while still associated with services.

### 7.7 Validation behavior
Service validation is enforced by Mongoose schema and by allowed field filtering in serviceService.js.

Examples:
- officialLink must match a regex; otherwise validation error.
- category required
- name/description required
- updateService only accepts specific allowed fields

### 7.8 What the Service model contributes to AI retrieval
For each service, the model contains fields that the retrieval engine directly searches:
- name
- description
- category.name via populate
- keywords
- eligibilitySummary
- commonUseCases
- localized name/description fields in some cases

This is critical because retrievalService.js searches those fields and boosts matches from names and keywords.

### 7.9 Service model field-by-field importance for frontend and retrieval
- name: displayed prominently in UI and search index
- description: used as fallback service explanation
- officialLink: used to send users to official portal
- category: used to filter and display category labels
- keywords: used by retrieval and search
- eligibilitySummary: used by AI context and frontend detail page
- requiredDocuments: used for DocumentReadinessWizard and AI follow-up questions
- commonUseCases: used by AI prompt context and fallback logic

---

## 8. AI SYSTEM — MOST IMPORTANT

### 8.1 AI provider and model
The actual provider is selected in server/services/aiService.js.

Provider selection logic:
- AI_PROVIDER environment variable is read.
- If AI_PROVIDER is huggingface, it uses HF_MODEL (default openai/gpt-oss-120b:fastest)
- If AI_PROVIDER is openai, it uses OPENAI_MODEL (default gpt-4o-mini)
- If no provider exists or if the key is missing, it falls back to a grounded retrieval fallback.

Environment variables that matter:
- AI_PROVIDER
- OPENAI_API_KEY
- OPENAI_MODEL
- HF_API_KEY
- HF_MODEL
- NODE_ENV

The repository contains server/.env with these variable names. The actual secret values are not printed here, as required.

### 8.2 AI provider implementation
Implemented provider paths:
- OpenAI via official openai Node SDK in aiService.js
- Hugging Face via providers/huggingface.js using OpenAI-compatible client with baseURL https://router.huggingface.co/v1

### 8.3 API method / endpoint
The AI request is a backend HTTP call triggered by the UI:
- frontend: axios POST /api/ai/assist
- backend route: server/routes/aiRoutes.js -> assist in aiController.js

The actual model invocation is not directly through a public API endpoint from the frontend. The backend calls the provider server-side.

### 8.4 Request structure
The OpenAI call uses client.responses.create({
- model
- instructions: built from the grounding prompt and service context
- input: buildOpenAIInput(message, history, services)
- temperature: 0.2
})

The Hugging Face provider uses client.chat.completions.create({
- model
- messages: [{role:"system", content: instructions}, {role:"user", content: message}]
- temperature: 0.2
- max_tokens: 350
})

### 8.5 Response format
The AI service returns an object like:
- answer
- recommendedServices: one item or empty array
- followUpSuggestions: []
- followUpQuestions: []
- actionPlan: []
- grounded: true
- provider: "openai" or "huggingface"

The controller passes this object to the frontend as the response data.

### 8.6 Temperature and generation settings
Verified from code:
- OpenAI: temperature = 0.2
- Hugging Face: temperature = 0.2, max_tokens = 350

These are conservative generation settings designed to reduce creativity and stay closer to the verified context.

### 8.7 Context / token limits
There is no explicit context-window token budget management beyond the system prompt and retrieved context. The code does not implement advanced token counting, truncation, or summarization at the provider level.

What is present:
- limited conversation history: last 12 messages in buildOpenAIInput; 6 messages used in retrieval query selection
- limited service context: only the top retrieved services are passed to AI
- max_tokens on HF call is 350

This is practical but not robust for very large contexts.

### 8.8 Where the AI request is made
The primary AI logic is in:
- server/services/aiService.js
- server/providers/huggingface.js
- server/controllers/aiController.js

The UI calls it only indirectly via /api/ai/assist.

### 8.9 Error handling in AI system
AI failure handling is robust but simple:
- if the key is missing, return buildFallback(...)
- if the provider throws, catch and then return buildFallback(...)
- if provider returns empty content, throw a custom error and fallback
- if retrieval yields no services, buildFallback triggers a “could not find a matching service” response

This means the system is designed to degrade gracefully instead of crashing or hallucinating.

### 8.10 Exact flow: user message to final answer
User message
→ aiController.js validates req.body.message and sessionId
→ history is loaded from conversationService.getConversation(sessionId)
→ detection of service topic: explicit-service pattern or conversation context fallback
→ retrievalQuery built from history and message
→ retrieveRelevantServices(retrievalQuery, 3)
→ ranking selects most relevant services from MongoDB
→ assistWithServices(message, services, history)
→ provider selection based on AI_PROVIDER and key existence
→ provider prompt built with serviceContext(services)
→ OpenAI or HF model call with grounded instructions
→ provider response returned
→ answer + recommendedServices returned
→ aiController.js appends messages to session memory and returns JSON
→ frontend AIAssistant stores response and renders it

### 8.11 Grounding and model prompt specifics
The system prompt in server/services/aiService.js is strong and important:
- “Use ONLY information explicitly provided in the verified service context.”
- “Do NOT add information from your general knowledge.”
- “Do NOT invent exact procedures, URLs, fees, deadlines, eligibility rules, documents, policies.”
- “When official website is mentioned, use only officialLink from context.”
- “If insufficient details, say the verified directory does not contain enough details...”

This is a meaningful grounding layer, though not a formal evaluator or policy enforcement system.

### 8.12 Notable limitations of the AI system
- Not using a formal RAG pipeline with embeddings or vector DB.
- Not validating the model’s answer against retrieved IDs beyond returning the top service ID; the answer itself is just text.
- Not implementing model output JSON schema validation.
- Not implementing content filtering or a separate moderation layer.
- No fine-grained evaluation harness for answer quality.

---

## 9. RETRIEVAL SYSTEM

### 9.1 Is it lexical, semantic, or embeddings-based?
This project is lexical and rule-based. It does not use embeddings, vector search, or a vector database.

Verified from code:
- retrievalService.js uses regex matching, tokenization, alias expansion, and scoring.
- searchSynonyms.js expands query with related terms, but it is still lexical.
- no embedding model, no vector DB dependency, no pgvector, no MongoDB Atlas Vector Search usage found.

### 9.2 What fields are searched?
In retrievalService.js, the search is built with a MongoDB $or over:
- name
- description
- keywords
- eligibilitySummary
- commonUseCases

The service search API also includes additional fields in serviceService.js:
- name_hi
- name_ta
- description_hi
- description_ta
- eligibilitySummary_hi
- eligibilitySummary_ta
- commonUseCases_hi
- commonUseCases_ta

### 9.3 Tokenization and stop-word removal
In retrievalService.js:
- normalize() lowercases and strips non-alphanumeric characters.
- words() splits into tokens.
- tokenize() filters tokens by length > 1 and removes stop words from STOP_WORDS.

Examples of stop words removed include: i, me, my, the, what, how, need, can, do, etc.

### 9.4 Alias and phrase expansion
The retrieval engine contains ALIASES and SEARCH_PHRASES.

Examples:
- aadhaar -> aadhar, uidai
- epf -> epfo, provident fund, pf, uan
- passport -> passport seva
- scholarship -> national scholarship portal
- cybercrime -> cyber crime, cyber complaint

This effectively expands the query to more service-specific terms.

### 9.5 Relevance scoring
The scoring function scoreService(service, tokens, phrases) adds points based on matches:
- exact service name match: 100
- name phrase match: 90
- exact keyword match: 80
- alias match: 70
- use case match: 40
- eligibility match: 30
- description match: 15
- generic match: 2

This is not a statistical ranking system; it is a rule-based weighted heuristic.

### 9.6 Retrieval algorithm
Pseudo-flow:
1. tokenize query
2. remove stop words
3. expand alias synonyms
4. detect important phrases like “passport seva”, “national scholarship portal”
5. perform MongoDB $or regex search for each term across relevant fields
6. collect candidate services
7. score each service using scoreService
8. filter out weak scoring results
9. keep strongest service and nearby strong services within a relative threshold
10. return up to limit results

### 9.7 Number of results retrieved
The AI controller calls retrieveRelevantServices(retrievalQuery, 3)
- default limit is 3 for the assistant

The general service search endpoint allows pagination with limit and page; not a fixed AI retrieval count there.

### 9.8 How weak or irrelevant results are handled
The engine does:
- filter candidates with score >= SCORE.description
- sort descending
- compute strongestScore and strongestCategory
- keep items where score equals strongestScore or score >= strongestScore * MIN_RELATIVE_SCORE or category matches strongestCategory
- return slice(0, limit)

This is a pragmatic “top cluster” approach; it prevents isolated weak results from being returned if a stronger match exists.

### 9.9 Example: “I lost my Aadhaar card”
Example query:
User: “I lost my Aadhaar card”

1. Query processing
- normalize => "i lost my aadhaar card"
- stop words removed => ["lost", "aadhaar", "card"]
- card is generic and may be ignored or treated as generic due to GENERIC_TERMS
- aliases expanded => aadhaar -> [aadhar, uidai]
- phrase detection sees “aadhaar” and maybe “uidai” from ALIASES

2. Matching
MongoDB query searches for "lost", "aadhaar", "card", "uidai" across:
- service name
- description
- keywords
- eligibilitySummary
- commonUseCases

3. Scoring
Aadhaar service likely gets strong points because:
- name contains Aadhaar or UIDAI
- keyword includes aadhaar, uidai, identity
- commonUseCases includes lost identity document or replacement
- description includes identity details

4. Ranking
The Aadhaar service scores highest; EPFO or PAN might also match some related tokens but usually score lower.

5. Selected services
The AI controller passes the top 3 relevant results to the AI service and returns the top service as the recommended service.

### 9.10 What this means for interviews
This is a transparent, rule-based retrieval layer, not a vector search or semantic ranking solution. It is well-suited to a constrained catalog but not for general semantic retrieval across a large corpus.

---

## 10. CONVERSATION CONTEXT

### 10.1 Where conversation history is stored
In-memory Map in server/services/conversationService.js.

```js
const sessions = new Map();
```

This is not a database-backed store or Redis cache. It resets when the backend restarts.

### 10.2 How many messages are retained
From conversationService.js:
- MAX_MESSAGES = 12
- MAX_SESSIONS = 500

The appendConversation function retains only the last 12 messages for each session and evicts oldest sessions when more than 500 sessions are stored.

### 10.3 How it is passed to retrieval
In aiController.js:

```js
const history = getConversation(sessionId);
const hasExplicitServiceTopic = /.../i.test(message);
const retrievalQuery = hasExplicitServiceTopic
  ? message
  : [...history.slice(-6).map((item) => item.content), message].join(" ");
```

Interpretation:
- if the new message clearly refers to a different service topic, the system uses the new message alone;
- otherwise, it mixes the last six user/assistant messages with the current message for retrieval.

### 10.4 How it is passed to the AI
In aiService.js buildOpenAIInput:
- history.slice(-12) is included in the provider input
- the service context is appended as JSON as a “Verified service context” block

This means the model gets both recent conversation and retrieved facts.

### 10.5 How follow-up questions work
The AI service includes a fallback built around history:
- if the latest message asks for documents and there is prior history, the fallback answers using the retrieved service’s requiredDocuments.
- if the latest message is a balance question and history suggests EPF discussion, it responds accordingly.
- if the latest message asks for status or tracking and previous history indicates the same service, it answers based on the description.

Examples from server/scripts/test-conversation.js verify:
- Aadhaar follow-up “What documents do I need?” after an Aadhaar lost-card initial message
- Passport follow-up “What documents are required?” after passport inquiry
- EPF balance follow-up after EPFO discussion

### 10.6 How system understands follow-up questions
The logic is a mix of:
- regex detection of relevant intents such as document, balance, status
- explicit service detection in aiController.js
- last message and last N conversation messages used as contextual retrieval query

This is manually coded rule detection, not a general conversational state manager.

### 10.7 Limitations
- memory is in-process only; no persistence or cross-server restart continuity
- no semantic coreference resolution beyond regex heuristics
- no long-term memory management
- no proper conversation summarization or pruning beyond raw message retention
- no cross-user conversation memory
- no user identity or auth context

---

## 11. GROUNDING / HALLUCINATION CONTROL

### 11.1 Grounding mechanisms
The strongest guardrails are in server/services/aiService.js.

System prompt text includes:
- Use ONLY information explicitly provided in the verified service context.
- Do not invent exact procedures or steps.
- Do not invent fees, deadlines, eligibility rules, documents, government policies, replacement procedures, or URLs.
- When mention official website, use only officialLink provided in context.
- If context is insufficient, say that the verified service directory does not have enough details.

### 11.2 Retrieved context
The AI prompt receives explicit service context via serviceContext(services), which includes:
- id
- name
- category
- description
- eligibility
- requiredDocuments
- commonUseCases
- officialLink
- keywords

The generated instructions embed that JSON directly before sending it to the model.

### 11.3 Restrictions on invented government schemes
The prompt explicitly forbids invented schemes, policies, fees, deadlines, documents, requirements, etc.

This is an important grounding measure, though it is only as strong as the model following the prompt and the quality of the retrieved data.

### 11.4 Restrictions on invented URLs
The prompt says:
- “When mentioning an official website, use only the officialLink provided in the verified service context.”
- “Do not make up URLs.”

The frontend also only renders links present in the service data and officialLink values from the DB.

### 11.5 Recommendation validation
The service recommendation list is not directly validated against a database lookup after the model responds; instead the code returns only the first retrieved service for recommendations in both openai and huggingface paths.

This reduces the risk of the AI inventing a service, but it does not fully validate every line of the model-generated answer.

### 11.6 Service ID validation
The response object is built with services[0] only when a service exists; otherwise an empty recommendedServices list is returned.

This strongly reduces the risk of returning a non-existent or inconsistent service ID.

### 11.7 What it does protect against
The code explicitly tries to protect against:
- invented government procedures
- invented deadlines or fees
- invented documents and eligibility criteria
- invented URLs
- drawing from generic knowledge instead of service directory context
- answering as if it knows exact current official procedural details when the directory does not contain them

### 11.8 What it does not fully protect against
This project does not fully protect against:
- model ignoring instructions
- subtle overgeneralization from retrieved context
- generic “confident but wrong” answers when the context is incomplete
- answer drift if the service directory itself contains stale or missing information
- prompt injection attacks or malicious user input designed to override instructions (not fully guarded)

The system is more grounded than a general-purpose chatbot, but not a formally audited production-state grounding pipeline.

---

## 12. FALLBACK AND ERROR HANDLING

### 12.1 When AI provider is unavailable
In aiService.js:
- if provider = huggingface and HF_API_KEY missing -> buildFallback
- if provider = openai and OPENAI_API_KEY missing -> buildFallback
- if provider call throws -> buildFallback

This fallback still uses retrieved services and gives a helpful answer like “I could not find a matching service...” or a closest-match summary.

### 12.2 When API request fails
Frontend catches axios error and displays:
- requestError.response?.data?.message
- or requestError.message
- or generic t("ai.unavailable")

No retry logic is implemented in the frontend call wrapper.

### 12.3 When invalid user message is sent
In aiController.js:
- empty string invalid
- over 1000 characters invalid
- invalid sessionId format invalid

It throws a 400 error with a message.

### 12.4 When database fails
connectDB() in server/config/db.js catches connection errors and calls process.exit(1).

This kills the server process if MongoDB is unreachable.

### 12.5 When no relevant service is found
buildFallback in aiService.js returns:
- answer: “I could not find a matching service in Sahaayak's verified directory.”
- recommendedServices: []
- follow-up suggestions: ask for document, benefit, department, or service

This is a graceful fallback for unknown queries.

### 12.6 When AI returns malformed output
The OpenAI code checks:
- if response.output_text is empty -> throw Error("OpenAI returned an empty response")

The Hugging Face path checks for empty answer.

Then it catches and uses fallback.

### 12.7 When user asks an unrelated question
The retrieval engine may return no services or a weak score. The fallback answer is honest: it cannot find a matching service.

### 12.8 When user asks a follow-up question
The system relies on:
- history retention in conversationService.js
- retrievalQuery built from recent history
- regex detection of document/balance/status questions

This is not a deep discourse model but works for common patterns.

### 12.9 Actual fallback logic trace
AI provider failure or missing key
→ catch block / missing key logic
→ buildFallback(message, services, history)
→ if no services, generic no-match answer
→ if one service exists, use primary service and choose specific answer based on document/balance/status detection
→ return grounded answer and recommendedServices with one top service

---

## 13. SECURITY

### 13.1 IMPLEMENTED
- Helmet middleware enabled in server.js
- CORS enabled in server.js
- dotenv used to keep environment data out of source control; actual values are in .env and not committed here as a file read in this audit
- input trimming for message and sessionId in aiController.js
- regex sanitization utility exists in server/utils/sanitizeRegex.js for some search queries
- allowed field selection for updates and creates reduces mass-assignment risk
- DB deletion protection in categoryService.js prevents deleting categories while services reference them
- frontend official links are opened with rel="noopener noreferrer" to reduce tabnabbing risk

### 13.2 NOT IMPLEMENTED / FUTURE IMPROVEMENT
- Authentication: none found
- Authorization: none found
- Rate limiting: none found
- request validation library: none found beyond schema-level validation
- CSRF protection: not evident
- API key protection beyond .env: not robust in production deployment if server is misconfigured
- secrets rotation or secret manager: not present
- user/session security: no signed session, no cookie-based auth, no secure session store
- prompt injection protection: no explicit sandboxing or sanitization beyond string trimming
- data leakage controls: conversation history is kept in memory and not persisted to DB, but it is still accessible to server memory and logs may leak in debug mode
- no input size or payload limit beyond 1000-char message validation in AI request

### 13.3 Secret handling
The repository does include .env files, but the audit must not print secret values. The code references env names like:
- MONGO_URI
- PORT
- AI_PROVIDER
- OPENAI_API_KEY
- OPENAI_MODEL
- HF_API_KEY
- HF_MODEL
- DEBUG_RETRIEVAL
- BHASHINI_USER_ID
- BHASHINI_API_KEY
- BHASHINI_PIPELINE_ID

The warning here is simple: do not expose values, and do not claim actual secret contents.

---

## 14. ERROR HANDLING ARCHITECTURE

### 14.1 Custom error classes
There are no custom error classes in the codebase. Errors are generally plain Error objects with a statusCode property.

Examples:
- aiController.js throws new Error("Please describe what you need help with."); error.statusCode = 400
- serviceService.js and categoryService.js also throw Error with statusCode = 404 or 409

### 14.2 Async error handling
asyncHandler.js wraps all async route handlers and calls next(error) if a promise rejects.

This is a standard, clean Express pattern.

### 14.3 Global error handler
server/middleware/errorHandler.js centralizes formatting for:
- CastError
- duplicate key error code 11000
- ValidationError
- custom error statusCode
- general server errors

The response includes success:false and message, with optional stack trace in non-production mode.

### 14.4 404 handling
server/middleware/notFound.js returns a 404 JSON response with message: "Route not found".

### 14.5 Validation errors
There are validation errors for:
- required fields in Mongoose schemas
- custom message validation in aiController.js
- URL regex validation on officialLink

### 14.6 MongoDB errors
The main MongoDB errors handled are:
- CastError: bad ObjectId
- Duplicate key error code 11000
- ValidationError via Mongoose schema

### 14.7 HTTP status codes
Verified usages:
- 200 OK for success
- 201 Created for create endpoints
- 400 Bad Request for invalid input and validation errors
- 404 Not Found for missing resources or routes
- 409 Conflict for category deletion when associated services exist
- 500 Internal Server Error as fallback

### 14.8 Frontend error handling
The frontend catches API failures and stores error messages locally. There are no global React error boundaries or retry/backoff logic.

---

## 15. PERFORMANCE AND LATENCY

### 15.1 Potential bottlenecks
- MongoDB queries for service search and retrieval
- AI API calls to OpenAI or Hugging Face
- multiple regex searches across fields
- repeated tokenization and alias expansion per request
- in-memory conversation map with bounded size but no persistence
- frontend loading and UI state is lightweight, but network latency is real

### 15.2 Database queries per request
For AI assistant request:
1. getConversation(sessionId)
2. retrieveRelevantServices(retrievalQuery, 3)
   - includes one database query with $or across fields
3. maybe populate category in the result
4. appendConversation(sessionId,...)

This is not a huge number of DB calls, but on a busy API it can become noticeable because the service retrieval is often doing regex queries across a full collection.

### 15.3 AI API calls
Each AI chat request triggers one provider call. That is the main latency component.

Potential bottlenecks:
- waiting for external AI API network latency
- provider timeout and maxRetries behavior
- fallback to no AI path when env is missing

### 15.4 Retrieval complexity
RetrievalService uses regex over candidate fields; for a moderate service dataset it is okay, but for larger datasets it will become expensive.

Important: it does not use indexes for text search heavily. It uses schema indexes for category, name, and keywords, but not full-text indexes. So the retrieval is more heuristic than optimized search.

### 15.5 Network calls
- browser to backend over Vite proxy or dev server
- backend to MongoDB
- backend to OpenAI/Hugging Face

No caching layer or CDN is implemented here.

### 15.6 Repeated work
- alias expansion and tokenization happen on every retrieval request
- searchSynonyms expands queries on every frontend service search
- no server-side cache
- no data memoization or response caching

### 15.7 Conversation history size
Limited to 12 messages per session, which is acceptable but still in-memory and ephemeral.

### 15.8 Caching
No actual caching layer is implemented. The project does not use Redis, in-memory query cache, or CDN caching.

### 15.9 Measurement status
NOT MEASURED.

This is an explicit interview note: there are no benchmark scripts or measured timings in the repo. If you are preparing for a Razorpay interview, measure:
- median AI response time
- median retrieval time from MongoDB
- 95th percentile latency
- effect of 12-message history on latency
- number of database calls and provider call retries

---

## 16. SCALABILITY

### 16.1 How it behaves at different loads
#### 10 users
Likely fine. A small MongoDB dataset plus a few JSON requests and one AI call per chat request should be manageable.

#### 100 users
Still possible in a single-node dev-like deployment, but concurrency may show pressure on external AI provider rate limits and database queries.

#### 1,000 users
The current implementation is not production-ready for this scale without more deliberate scaling design. Bottlenecks would include:
- sequential AI provider calls with no queue
- in-memory session store not distributed
- no rate limiting or request throttling
- no DB connection pooling optimization beyond default Mongoose behavior
- no caching

#### 10,000 concurrent users
Not supported as-is. This would fail first at:
- AI provider API concurrency/rate limits
- server memory for in-memory sessions
- lack of horizontal scaling coordination
- no load balancer or distributed session store
- no observability or autoscaling

### 16.2 Current bottlenecks
- AI external latency and dependency risk
- no queue system for asynchronous AI work
- in-memory conversation store only on one process
- no rate limiting or abuse protection
- no caching on search results
- regex-based fuzzy retrieval may be costly at scale

### 16.3 What would need to change
- add rate limiting
- add proper logging and tracing
- add queueing for AI tasks if workload spikes
- move conversation/session storage to Redis or DB
- add caching for categories and popular searches
- consider full-text indexing or Elasticsearch/Atlas Search for large corpus
- evaluate using embeddings and vector DB once dataset grows
- use load balancers and horizontal scaling with stateless app servers

### 16.4 Database scaling
Options that would matter:
- proper MongoDB indexing for search-heavy queries
- full-text indexes or Atlas Search
- sharding when dataset exceeds single-node capacity
- read replicas for browse workloads

The current model has only basic indexes, not production-grade search indexes.

### 16.5 AI API concurrency
The code does not implement concurrency control, queueing, or backpressure. A burst of AI requests would likely hit provider limits and slow response times.

### 16.6 Observability
There are logs, but no structured metrics, tracing, or dashboards. Observability is minimal.

---

## 17. WHAT BROKE / ENGINEERING CHALLENGES

Historical failure not verifiable from current repository.

This repository does not include explicit incident logs, bug reports, ADRs, changelogs, or issue-tracker artifacts that document a historical failure.

The code does show defensive patterns and fallback logic, but not the story of a past outage or migration. That is important: the project appears to have been designed thoughtfully, but there is no evidence of a documented production incident in the current repository.

### Evidence of challenge handling found in code
- Retrieval fallback for “no match” queries
- Provider fallback for missing keys and API failures
- Category deletion protection to avoid broken references
- Mongoose validation and centralized error handling
- Session limits to avoid memory blow-up

These are challenge-handling patterns, but not historical failure narratives.

---

## 18. TESTING

### 18.1 Existing tests found
There are explicit Node-based verification scripts in server/scripts:
- test-retrieval.js
- test-conversation.js

These use Node assert and run with straightforward assertions. They are not a formal test framework like Jest or Vitest.

### 18.2 What is tested
#### retrieval tests
server/scripts/test-retrieval.js verifies:
- Aadhaar requests rank Aadhaar top
- EPF-related queries rank EPFO top
- passport, scholarship, cybercrime queries match expected services
- stop words like "I need help" produce no meaningful retrieval tokens

#### conversation tests
server/scripts/test-conversation.js verifies:
- document follow-up after Aadhaar lost-card message
- document follow-up after passport inquiry
- EPF balance follow-up after prior EPFO context
- ambiguous input returns no recommended services and suggestions

### 18.3 What is not tested
The repo does not appear to include:
- API integration tests for /api/ai/assist
- end-to-end frontend tests
- end-to-end app tests with actual browser automation
- load/performance tests
- prompt injection tests
- hallucination evaluation tests
- timeout/retry tests for provider failures
- security tests
- schema migration tests

### 18.4 Important missing tests for an AI production system
- provider down / timeout fallback tests
- malformed model response tests
- incorrect service ID returned test
- prompt injection tests
- irrelevant query / no match tests
- long conversation memory boundary tests
- multi-turn ambiguous follow-up tests
- evaluation of recommendation precision and recall
- retrieval threshold tests
- error logging and monitoring tests
- content safety tests
- rate limit / abuse tests
- database failure tests

### 18.5 Important edge cases
- empty message
- message > 1000 chars
- invalid sessionId format
- no relevant service found
- AI API key absent
- AI returns empty string or malformed data
- follow-up question about a different topic than previous one
- category deletion with associated services

---

## 19. CURRENT LIMITATIONS

These are limits that are actually applicable based on the code:

- Lexical retrieval instead of semantic retrieval: yes, verified from code in retrievalService.js.
- No vector database or embeddings: yes, verified from code.
- Small, curated dataset: likely true, but the exact size is not fully enumerated in the code. The README says 31 services and 10 categories, and the seed script suggests a curated dataset.
- No production-grade rate limiting: verified by absence of express-rate-limit or equivalent.
- No authentication/authorization: verified.
- No real-time government data sync: verified by static seed dataset and no API to refresh government data.
- No automated evaluation for quality and groundedness: verified by absence of eval harness.
- In-memory conversation state: verified, not distributed or persistent.
- AI answer reliability depends on prompt quality and retrieved context quality: verified and honest.
- Frontend is a prototype UI, not enterprise-strength admin/ops monitoring: no admin dashboards or instrumentation.

---

## 20. FUTURE IMPROVEMENTS

### HIGH PRIORITY
1. Add real authentication and authorization
- Why it matters: current API is basically open.
- Benefit: protects admin operations and user sessions.

2. Add rate limiting and abuse protection
- Why it matters: AI endpoints can be abused and external API costs can spike.
- Benefit: safer production operation.

3. Add a proper evaluation harness for retrieval and groundedness
- Why it matters: without evaluation, it is hard to know whether the assistant is improving.
- Benefit: measurable product quality.

4. Add structured logging and request metrics
- Why it matters: operational visibility is minimal.
- Benefit: easier debugging and scale planning.

5. Replace in-memory session store with Redis or DB-backed sessions
- Why it matters: current sessions are lost on restart and not shared across instances.
- Benefit: better reliability and multi-instance deployment.

### MEDIUM PRIORITY
1. Add embeddings and vector search
- Why it matters: lexical retrieval will struggle as the dataset grows and queries become more natural.
- Benefit: better semantic matching.

2. Add full-text search indexing for MongoDB
- Why it matters: improves retrieval efficiency for service names and descriptions.
- Benefit: lower latency and better scaling.

3. Add source metadata and freshness timestamps
- Why it matters: government information changes; records need freshness metadata.
- Benefit: trust and usability.

4. Add stronger input validation and schema validation
- Why it matters: the current validation is a mix of Mongoose + custom checks.
- Benefit: better API safety.

5. Add content moderation and prompt-injection handling
- Why it matters: a public AI assistant is exposed to malicious input.
- Benefit: safer AI use.

### LONG TERM
1. Add multilingual AI generation and retrieval-aware language flow
- Why it matters: citizen services are accessed across languages.
- Benefit: better accessibility.

2. Add a data-refresh pipeline from official sources
- Why it matters: raw government data is manually curated and can get stale.
- Benefit: more trustworthy service catalog.

3. Add queue-based AI orchestration and workload isolation
- Why it matters: scale beyond a few users.
- Benefit: resilience under bursts.

4. Add observability, dashboards, and tracing across frontend/backend/AI calls
- Why it matters: performance and cost visibility is necessary in production.
- Benefit: reliable operations.

---
