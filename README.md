# Machine Learning Roadmap Tracker

A comprehensive 12-week roadmap tracking application designed to help learners systematically master Artificial Intelligence, Machine Learning, and Deep Learning.

## Architecture & Technology Stack

This application is built with a separated frontend and backend architecture, utilizing modern frameworks and cloud deployment services.

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS & Lucide React (Icons)
- **Deployment:** Vercel (Configured with SPAs routing via `vercel.json`)
- **Key Features:** Fully localized (i18n), Dashboard KPI Metrics, Recharts visualization, and Dynamic theming (Light/Dark/Dimmed).

### Backend
- **Framework:** Laravel 11.x (REST API)
- **Database:** MongoDB Atlas (Utilizing standard native PHP drivers)
- **Authentication:** Laravel Sanctum & Laravel Socialite (Google OAuth 2.0)
- **AI Integration:** Groq API (LLaMA 3.1 8B Model) for intelligent code reviews and weekly reflections.
- **Deployment:** Render.com (Configured via custom `Dockerfile` for seamless PHP and MongoDB Extensions support)

## Key Features

- **Structured Tracking:** Manage weekly tasks with statuses covering Not Started, In Progress, Blocked, and Done.
- **AI Coach Reviewer:** Integrated LLaMA 3.1 8B engine providing zero-latency, professional Indonesian language feedback for submitted learning materials and weekly learning self-reflections.
- **Google OAuth Login:** Secure 1-click authentication linked with your Google credentials.
- **Progress Analytics:** Visual representations of your submission rates, task completion status, and dynamic charts for timeline tracking.
- **Submission Portfolio:** Maintains a digital footprint of submitted GitHub repositories and Colab Notebooks.

## Installation for Local Development

### 1. Prerequisites
- Docker (optional but recommended for isolated environment)
- PHP 8.2 or higher
- Composer
- Node.js & npm
- A MongoDB cluster (Atlas or Local)

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Duplicate the `.env.example` file and configure it:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Set up the environment parameters in `.env`:
   - `MONGODB_URI`
   - `MONGODB_DATABASE`
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` (For OAuth)
   - `DEEPSEEK_API_KEY` (Using your Groq API Key)
5. Start the backend local development server:
   ```bash
   php artisan serve
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Production Deployment Checklist

To deploy to production (Vercel & Render):

1. **Deploy Frontend on Vercel:** Ensure the `vercel.json` file is present to handle React Router fallbacks. Set `VITE_API_URL` environment variable pointing to the Render backend.
2. **Deploy Backend on Render:** Use the "Docker" runtime environment to allow the embedded `Dockerfile` to compile the `ext-mongodb` driver.
3. **Google Cloud Console:** Update "Authorized JavaScript origins" with your Vercel URL and "Authorized redirect URIs" with the complete Render callback path.
4. **CORS Validation:** Ensure `CORS_ALLOWED_ORIGINS` in Render exactly matches the protocol and domain of the Vercel app.

## License

This project is intended for educational purposes and internal tracking only. All rights reserved.
