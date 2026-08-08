# Mutual Funds Performance Prediction
**🔗 Live Demo:** [mutualfundsperformanceprediction.up.railway.app](https://mutualfundsperformanceprediction.up.railway.app/)
A full-stack web application for tracking mutual fund NAV performance, calculating SIP (Systematic Investment Plan) returns, and forecasting future NAV using multiple machine learning models.

## Features

- **SIP Calculator** — projects invested amount, future value, and annualized return for 1/3/5-year horizons based on a fund's historical CAGR.
- **NAV Trend Visualization** — actual vs. predicted NAV charts and model comparison charts using Recharts.
- **Multi-Model NAV Forecasting** — trains and compares three forecasting approaches side by side on each fund's historical NAV series:
  - **Linear Regression** (Weka) — fits a straight-line trend
  - **Random Forest** (Weka) — ensemble of decision trees, captures nonlinear patterns
  - **Drift Method** — classic time-series baseline that extrapolates the recent average period-over-period change
- **Algorithm Accuracy Comparison** — evaluates each model's accuracy (MAPE-based) on a held-out test split of historical NAV data, with a star rating and ranking per model. Rankings genuinely vary fund-to-fund — no single model wins by default.
- **Risk & Volatility Stats** — mean NAV, standard deviation, and volatility-based risk classification (Low/Medium/High/Very High).
- **AI Fund Assistant** — an in-app chat widget that answers quick questions ("what's the trend?", "which model is best?", "how does SIP look?") using the fund's own computed stats. It's a lightweight rule-based assistant, not an LLM.
- **PDF Report Export** — downloadable performance report via jsPDF + html2canvas.

## Tech Stack

**Frontend:** React (Vite), Axios, Recharts, jsPDF, html2canvas
**Backend:** Java, Spring Boot, Weka (machine learning library)
**Data:** CSV-based historical NAV datasets per fund/AMC

## A note on the data

The NAV datasets in `backend/src/main/resources/data/` are **synthetically generated**, not pulled from real historical fund records. They're built as a realistic monthly random walk per fund — with genuine up and down months, fund-specific volatility, and plausible CAGRs — so the ML models train and evaluate on data that behaves like a real fund rather than a perfectly smooth, always-increasing series. If you want to swap in real history, AMFI publishes historical NAV data for Indian mutual funds free of charge.

## Project Structure

```
MutualFundsPerformance/
├── backend/     # Spring Boot REST API (fund data, SIP calc, ML predictions)
└── frontend/    # React + Vite dashboard UI
```

## Getting Started

### Prerequisites

- Java 17+ and Maven
- Node.js 18+ and npm

### Backend

```bash
cd backend
mvn spring-boot:run
```

Runs on `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` (or the next available port).

> **Note:** `frontend/src/services/api.js` points `baseURL` at a deployed Railway backend by default. Point it at `http://localhost:8080/api/fund` for local development, and switch it back before deploying the frontend.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/fund/amc-list` | List of available AMCs |
| GET | `/api/fund/fund-list?name={amc}` | Funds under a given AMC |
| GET | `/api/fund/by-fund?fund={fund}` | Historical NAV data, stats, and algorithm accuracy comparison |
| GET | `/api/fund/predict?fund={fund}` | 6-month forward NAV forecast across Drift/Linear/Random Forest models |

## Screenshots

<img width="1890" height="941" alt="image" src="https://github.com/user-attachments/assets/e09dc815-aa12-40f8-8ecb-449e38444091" />
<img width="1896" height="955" alt="image" src="https://github.com/user-attachments/assets/6c27408a-3e91-46bb-bf69-3f92f9d70a4f" />
<img width="1884" height="899" alt="image" src="https://github.com/user-attachments/assets/5542255b-e936-486c-a74e-fe568dab31df" />
<img width="1895" height="956" alt="image" src="https://github.com/user-attachments/assets/dffa73c7-f2b2-48c3-a00d-8ab31242dfc3" />
<img width="1902" height="957" alt="image" src="https://github.com/user-attachments/assets/d97f643c-7919-4279-a41b-1d3c1c52422e" />
<img width="1906" height="954" alt="image" src="https://github.com/user-attachments/assets/897ea203-43bf-4577-ad16-2243de028aba" />
<img width="1894" height="974" alt="image" src="https://github.com/user-attachments/assets/449da4bb-4388-42b3-89ff-65a73992dcb6" />
<img width="1890" height="954" alt="image" src="https://github.com/user-attachments/assets/bbac1faa-3f3f-4593-b3ba-9e6e9b65c6c1" />
<img width="1887" height="960" alt="image" src="https://github.com/user-attachments/assets/c15bf4de-e230-44f4-a074-d9fbb1dee8fd" />
<img width="1895" height="962" alt="image" src="https://github.com/user-attachments/assets/a2bf61d1-2755-434c-bc6d-7bd8d88086c7" />
<img width="356" height="417" alt="image" src="https://github.com/user-attachments/assets/d6022b2b-018e-44e9-9ab7-4a4913e9b729" />





## Future Improvements

- Pull real historical NAV data from a live mutual fund API (e.g. AMFI) instead of synthetic CSVs
- Add authentication for personalized SIP tracking
- Expand ML model comparison with more sophisticated time-series techniques (true ARIMA, LSTM, etc.)
- Swap the rule-based Fund Assistant for an actual LLM-backed chat integration
