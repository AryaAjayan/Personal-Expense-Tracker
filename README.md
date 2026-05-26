# SpendStack

A modern, full-stack web application designed to help you track, categorize, and manage your daily expenses effortlessly. Built with a React frontend and a FastAPI (Python) backend, the application features a stunning glassmorphic interface, dynamic data visualization, and comprehensive monthly reporting.

## What Was Built

### 1. Premium Frontend (React & Vite)
*   **Aesthetic UI**: A beautifully crafted "glassmorphism" design featuring dynamic gradients, translucent cards, smooth micro-animations, and the crisp **Inter** font for a truly premium feel.
*   **Data Visualization**: Integrated **Recharts** to bring your data to life. View your spending habits through colorful Category Donut Charts and Daily Spending Bar Charts on both the main dashboard and specific monthly reports.
*   **Dashboard & Management**: View your current expenses with options to search, filter by date, and filter by category. Add, edit, and delete expenses through a sleek, backdrop-blur modal.
*   **Monthly Summaries**: Automatically aggregates your expenses by month. Clicking on a month navigates to a dedicated page showing total spent, a detailed category breakdown, and month-specific charts.
*   **Theming**: Built-in support for both **Light and Dark modes**, with a global toggle that updates the entire aesthetic instantly.
*   **Resilience**: A global React **Error Boundary** ensures the app never crashes to a blank screen, gracefully handling unexpected issues with a polite fallback UI.
*   **Localization**: All financial data is localized to display the **Indian Rupee (₹)** symbol.

### 2. Robust Backend (FastAPI)
*   **RESTful API**: Blazing fast endpoints for creating, reading, updating, and deleting expenses (`/api/expenses`).
*   **Data Aggregation**: Optimized endpoints to group expenses by month and sum totals efficiently using SQLite's built-in `strftime`.
*   **Validation**: Uses Pydantic v2 schemas to ensure strict data validation, guaranteeing data integrity when saving or updating transactions.

## Why It Was Built

The application was built to provide a fast, beautiful, and straightforward way to keep track of personal finances without relying on complex, bloated third-party services. The focus is on **premium user experience and speed**, ensuring that analyzing spending habits or logging a new expense feels satisfying and takes only seconds. The addition of charts and analytics gives clear, high-level insights into financial trends.

## Tech Stack

*   **Frontend**: React 19, TypeScript, Vite, TailwindCSS v4, **Recharts** (Data Visualization), React Query, React Router, Lucide React (icons).
*   **Backend**: Python 3.12, FastAPI, SQLAlchemy, Pydantic v2, Uvicorn.
*   **Database**: SQLite (local database file).

---

## How to Run the App Locally

You will need to open **two** terminal windows—one for the backend server and one for the frontend server.

### 1. Start the Backend Server

Open your terminal or command prompt, navigate to the `backend` directory, activate the virtual environment, and start the server:

```bash
cd backend
# On Windows:
.\venv\Scripts\Activate
# On Mac/Linux:
# source venv/bin/activate

# Start the server with hot-reloading
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will run at `http://localhost:8000`.

### 2. Start the Frontend Development Server

Open a **second** terminal window, navigate to the `frontend` directory, install dependencies, and start the Vite server:

```bash
cd frontend
npm install
npm run dev
```

The application will be accessible in your web browser at `http://localhost:5173`.
