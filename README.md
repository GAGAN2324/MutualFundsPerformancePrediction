# Mutual Funds Performance Prediction

A full-stack web application for tracking mutual fund NAV performance, calculating SIP (Systematic Investment Plan) returns, and forecasting future NAV using multiple machine learning models.

## Features

- **SIP Calculator** — projects invested amount, future value, and annualized return for 1/3/5-year horizons based on a fund's historical CAGR.
- **NAV Trend Visualization** — actual vs predicted NAV charts using Recharts.
- **Multi-Model NAV Forecasting** — compares three forecasting approaches side by side:
  - Linear Regression (Weka)
  - Random Forest (Weka)
  - Drift-based ARIMA approximation
- **Algorithm Comparison Table** — evaluates model accuracy (MAPE-based) on a held-out test split of historical NAV data, with a star rating per model.
- **Risk & Volatility Stats** — mean NAV, standard deviation, and volatility-based risk classification (Low/Medium/High/Very High).
- **PDF Report Export** — downloadable performance report via jsPDF + html2canvas.

## Tech Stack

**Frontend:** React (Vite), Axios, Recharts, jsPDF, html2canvas
**Backend:** Java, Spring Boot, Weka (machine learning library)
**Data:** CSV-based historical NAV datasets per fund/AMC

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
Runs on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/fund/amc-list` | List of available AMCs |
| GET | `/api/fund/fund-list?name={amc}` | Funds under a given AMC |
| GET | `/api/fund/by-fund?fund={fund}` | Historical NAV data, stats, and algorithm accuracy comparison |
| GET | `/api/fund/predict?fund={fund}` | 6-month forward NAV forecast across ARIMA/Linear/RF models |

## Screenshots

*(add screenshots of the dashboard here)*

## Future Improvements

- Persist and retrieve real historical NAV data from a live mutual fund API instead of static CSVs
- Add authentication for personalized SIP tracking
- Expand ML model comparison with more sophisticated time-series techniques
