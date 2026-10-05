# 🌾 AI-Powered Agriculture Crop Advisory Assistant (CropAdvisor AI)

A complete, production-grade agricultural decision-support web application that empowers farmers, growers, and agronomists to optimize crop health, soil suitability, irrigation, and pest management using **Google Gemini AI** (`@google/genai`) and modern full-stack web engineering.

---

## 🚀 Key Features

### 1. 🔐 User Authentication & Persistent Sessions
- Secure user registration and login with **bcrypt** password hashing and **JSON Web Tokens (JWT)**.
- User-specific advisory logs and farm history tracking.
- Guest diagnosis mode allows immediate farm analysis prior to account creation.

### 2. 📝 Comprehensive Agriculture Advisory Diagnostic Wizard
- **Farm Profile**: Farm name, location, farm size, unit (Acres, Hectares, Bigha, etc.), soil type (Alluvial, Black/Vertisol, Red, Sandy, Clay, Saline), soil pH slider, fertility status, previous crops, irrigation infrastructure, and water availability.
- **Crop Information**: Current crop selection (Wheat, Paddy/Rice, Tomato, Cotton, Maize, etc.), variety/hybrid, growth stage (Pre-sowing, Seedling, Vegetative, Flowering/Tillering, Fruiting/Grain Filling, Harvest), planting and harvest dates.
- **Environmental Factors**: Temperature (°C), recent precipitation (None, Light, Moderate, Heavy, Excessive), current weather conditions, humidity %, and seasonal cycle.
- **Crop Health & Symptom Diagnosis**: Free-text symptom observations, leaf discoloration taxonomy (Chlorosis, Necrosis, Purpling, Mottling, Powdery coatings, Lesions), growth abnormalities, soil problems, and pest/disease sightings.
- **Farming Inputs & Management**: Baseline fertilizers applied, pesticides used, organic manures (FYM, Vermicompost, Green Manure, Biofertilizers), and irrigation cadence.
- **Farmer Objective**: Yield improvement, disease risk reduction, fertilizer cost optimization, soil biology enhancement, or pest diagnosis.
- **Instant Sample Presets**: 1-click loading of real agricultural configurations (*Wheat - Vegetative Stage*, *Paddy/Rice - Tillering Stage*, *Tomato - Fruiting Horticulture*).

### 3. 🤖 AI Crop Advisory Synthesis (`@google/genai`)
- Structured JSON outputs strictly validated with **Zod**.
- **Crop Suitability Score** (0-100) with visual radial gauge and favorable/limiting environmental factors.
- **Soil Suitability & Mineral Amendments**: Customized organic carbon, gypsum, and pH amendment recommendations.
- **Irrigation & Water Conservation**: Water demand level, timing recommendations (early morning to suppress fungal spores), and mulching strategies.
- **Targeted Fertilizer Schedules**: Basal recommendations, split top-dressing doses, micronutrient foliar blends (Zn, B, Fe), and biofertilizer alternatives.
- **Pest & Disease Risk Assessment**: Correlated pathogen identification against observed symptoms, chemical management thresholds, and biological remedies.
- **Weather-Related Considerations**: Thermal stress management and rainfall drainage advisories.
- **Interactive Action Plan Timeline**: Categorized into **Immediate (24–48 Hours)**, **Short-Term (1–2 Weeks)**, and **Long-Term / Harvest Management** with interactive task checkboxes.
- **Information Gaps & Warnings**: Flags unverified field parameters (e.g. untested pH) without hallucinating facts.
- **Scientific Agronomic Explanations & Legal Disclaimers**: Grounded in plant physiology and Integrated Pest Management (IPM).

### 4. 📊 Dashboard & History Management
- KPI cards: Total advisories, monitored crops, average suitability index, and pest status.
- Recent advisory spotlight with quick report access.
- Searchable and filterable history logs (by crop, location, and risk level).
- Print / Export PDF formatted advisory reports.
- Record deletion with owner authorization checks.

### 5. ⚙️ System Status & Settings
- Real-time diagnostic monitors for Express REST API, PostgreSQL database connectivity, and Gemini AI SDK status.
- Dynamic session Gemini API key configuration.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, React Router v7 |
| **Backend** | Node.js (v24), Express.js, TypeScript, tsx, CORS, dotenv |
| **AI Integration** | `@google/genai` (Google Gemini 2.5 Flash) + Expert Agronomy Engine Fallback |
| **Database** | PostgreSQL (compatible with Replit PostgreSQL, Neon, Supabase) + Local Persistent Storage Adapter |
| **Validation** | Zod Schema Validation on frontend & backend |
| **Security** | bcryptjs password hashing, JWT Bearer tokens, Parameterized SQL queries |

---

## 📦 Project Structure

```text
├── client/                     # Vite + React + TypeScript Frontend
│   ├── public/                 # Static assets (hero image, favicon)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ActionTimeline.tsx   # Interactive 3-stage action plan
│   │   │   ├── ConfidenceGauge.tsx  # Radial & linear score gauges
│   │   │   ├── Footer.tsx           # Advisory disclaimer & footer
│   │   │   ├── LoadingSkeleton.tsx  # Multi-phase agronomic AI loader
│   │   │   ├── Navbar.tsx           # Sticky navigation with auth states
│   │   │   └── RiskBadge.tsx        # Color-coded risk indicators
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Authentication state provider
│   │   ├── pages/
│   │   │   ├── AdvisoryDetails.tsx  # 14-section comprehensive report view
│   │   │   ├── AdvisoryHistory.tsx  # Filterable advisory records list
│   │   │   ├── Dashboard.tsx        # Main analytics & spotlight dashboard
│   │   │   ├── Login.tsx            # Farmer sign in with demo autofill
│   │   │   ├── NewAdvisory.tsx      # 5-step diagnostic wizard
│   │   │   ├── Register.tsx         # Account registration page
│   │   │   └── Settings.tsx         # System status & Gemini API key config
│   │   ├── services/
│   │   │   └── api.ts               # Typed REST API client
│   │   ├── types.ts                 # Full frontend TypeScript declarations
│   │   ├── App.tsx                  # Main routes and application layout
│   │   └── index.css                # Tailwind CSS v4 & theme variables
│   └── vite.config.ts          # Vite configuration with /api reverse proxy
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config.ts           # Environment configuration
│   │   ├── db/
│   │   │   └── db.ts           # PostgreSQL client with parameterized SQL
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT authentication middlewares
│   │   │   └── validate.ts     # Zod request body validation
│   │   ├── routes/
│   │   │   ├── advisory.ts     # Advisory generation, history, and stats
│   │   │   └── auth.ts         # Register, login, and profile routes
│   │   ├── services/
│   │   │   └── gemini.ts       # @google/genai integration & agronomy engine
│   │   ├── types/
│   │   │   └── index.ts        # Backend data types and schemas
│   │   └── index.ts            # Server entry point & health check
│   ├── tsconfig.json
│   └── package.json
├── .env                        # Environment variables (GEMINI_API_KEY, DATABASE_URL)
└── package.json                # Root monorepo scripts (concurrent dev)
```

---

## 🏃 Running the Application

### 1. Install Dependencies
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 2. Configure Environment (`.env`)
Create or edit `.env` in the root directory:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=postgres://user:password@host:5432/dbname
JWT_SECRET=your_secure_random_jwt_secret
```
> *Note: If `DATABASE_URL` is omitted, the app will run with a persistent local SQL storage adapter, maintaining full PostgreSQL compatibility. If `GEMINI_API_KEY` is omitted, the built-in agronomy expert rules engine provides full diagnoses until a key is added.*

### 3. Start Development Server
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 4. Build for Production
```bash
npm run build
```
Creates compiled TypeScript in `server/dist` and optimized assets in `client/dist`.

---

## 🧪 Verified User Flows
- ✅ **Dashboard**: Metric KPIs, quick scenarios, and recent advisory spotlight.
- ✅ **Wizard Form**: 5-step intuitive farm diagnosis with sample presets.
- ✅ **AI Diagnostic Report**: Complete 14-section response with interactive action items and print mode.
- ✅ **History**: Search, risk filter, full report view, and delete operations.
- ✅ **Authentication**: Bcrypt hashing, token issuance, and protected user histories.
- ✅ **System Status**: Dynamic Gemini key updates and database health monitoring.
