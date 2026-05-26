# Personal Expense Tracker

A modern, full-stack web application designed to help you track, categorize, and manage your daily expenses effortlessly. Built with a React frontend and a FastAPI (Python) backend, the application features an intuitive dashboard, detailed category breakdowns, and a dedicated monthly summary report generator.

## What Was Built

1.  **Frontend (React & Vite)**
    *   **Dashboard**: Displays your current expenses with options to search, filter by date, and filter by category.
    *   **Expense Management**: A clean modal interface to Add, Edit, and Delete expenses.
    *   **Monthly Summaries**: Automatically aggregates your expenses by month and displays them as cards. Clicking on a month navigates to a dedicated page showing total spent and a detailed category breakdown for that specific month.
    *   **Routing**: Utilizes `react-router-dom` to provide seamless navigation between the main dashboard and specific monthly reports.
2.  **Backend (FastAPI)**
    *   **RESTful API**: Endpoints for creating, reading, updating, and deleting expenses (`/api/expenses`).
    *   **Data Aggregation**: Optimized endpoints to group expenses by month and sum totals efficiently using SQLite's built-in `strftime`.
    *   **Robust Error Handling & Validation**: Uses Pydantic v2 schemas to ensure clean data validation, preventing bugs when saving/updating transactions.

## Why It Was Built

The application was built to provide a fast, local, and straightforward way to keep track of personal finances without relying on complex, bloated third-party services. The focus is on **usability and speed**, ensuring that entering a new expense or looking up past spending takes only seconds. The recent addition of the **Monthly Summary Report** was designed specifically to give clear, high-level insights into spending habits on a month-to-month basis.

## Tech Stack

*   **Frontend**: React 19, TypeScript, Vite, TailwindCSS v4, React Query, React Router, Lucide React (icons).
*   **Backend**: Python 3, FastAPI, SQLAlchemy, Pydantic v2, Uvicorn.
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

Open a **second** terminal window, navigate to the `frontend` directory, install dependencies (if you haven't already), and start the Vite server:

```bash
cd frontend
npm install
npm run dev
```

The application will be accessible in your web browser at `http://localhost:5173`.
