import React, { useMemo, useState, useEffect } from "react";

export default function SIPCalculator({
                                          selectedFund = null,
                                          monthlySIP = 2000,
                                          durations = [1, 3, 5],
                                      }) {
    const [sipAmount, setSipAmount] = useState(monthlySIP);

    // FUND NAME
    const fundName =
        selectedFund?.name ||
        selectedFund?.fundName ||
        selectedFund?.model ||
        "No fund selected";

    // ---------------- CAGR FROM HISTORY ----------------
    const computeAnnualReturnFromHistory = (history = [], dates = []) => {
        if (!history || history.length < 2) return 0;

        const first = Number(history[0]);
        const last = Number(history[history.length - 1]);
        if (!isFinite(first) || first <= 0) return 0;

        let years = null;
        try {
            if (dates.length >= 2) {
                const start = new Date(dates[0]);
                const end = new Date(dates[dates.length - 1]);
                years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);
            }
        } catch (err) {
            years = null;
        }

        if (!years || years <= 0) years = history.length / 12;

        return Math.pow(last / first, 1 / years) - 1;
    };

    // ---------------- EXPECTED RETURN ----------------
    const expectedAnnualReturn = useMemo(() => {
        if (!selectedFund) return 0;

        // FIX: backend/App.jsx now uses "navValues" instead of "history".
        // Fallback to "history" kept in case an older data shape is passed in.
        const hist = selectedFund.navValues || selectedFund.history || [];
        const dates = selectedFund.dates || [];

        const derived = computeAnnualReturnFromHistory(hist, dates);
        return isFinite(derived) ? derived : 0;
    }, [selectedFund]);

    // ---------------- SIP CALCULATION ----------------
    const calcSIP = (monthly, years, annualRate) => {
        const r = annualRate / 12;
        const n = years * 12;

        if (r === 0) {
            return { invested: monthly * n, value: monthly * n, annualizedReturn: 0 };
        }

        const fv = monthly * ((Math.pow(1 + r, n) - 1) / r);
        const invested = monthly * n;

        const annualizedReturn =
            invested > 0 ? Math.pow(fv / invested, 1 / years) - 1 : 0;

        return { invested, value: fv, annualizedReturn };
    };

    // ---------------- FINAL RESULTS ----------------
    const results = useMemo(() => {
        return durations.map((yr) => ({
            years: yr,
            ...calcSIP(sipAmount, yr, expectedAnnualReturn),
        }));
    }, [sipAmount, expectedAnnualReturn]);

    // ---------------- FORMATTERS ----------------
    const fmt = (v) =>
        typeof v === "number"
            ? v.toLocaleString(undefined, { maximumFractionDigits: 2 })
            : "-";

    const pct = (v) =>
        typeof v === "number" ? `${(v * 100).toFixed(2)}%` : "-";

    useEffect(() => {
        setSipAmount(monthlySIP);
    }, [monthlySIP]);

    return (
        <div
            style={{
                borderRadius: 12,
                padding: 18,
                background: "linear-gradient(180deg,#07121a 0%, #061215 100%)",
                color: "#e6fbff",
                width: "100%",
                boxShadow: "0 6px 24px rgba(0,180,255,0.06)",
                marginTop: 10,
            }}
        >
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ color: "#00eaff" }}>💰 SIP Calculator</h3>

                <div style={{ textAlign: "right", color: "#9fe8ff" }}>
                    <div><strong>Fund:</strong> {fundName}</div>
                    <div>Expected Return: {pct(expectedAnnualReturn)}</div>
                </div>
            </div>

            {/* MONTHLY INPUT */}
            <div style={{ marginTop: 12 }}>
                <label style={{ color: "#9fe8ff", fontSize: 13 }}>Monthly SIP</label>
                <input
                    type="number"
                    value={sipAmount}
                    onChange={(e) => setSipAmount(Number(e.target.value))}
                    style={{
                        marginTop: 6,
                        padding: "8px 10px",
                        borderRadius: 8,
                        background: "#00121a",
                        color: "#bffaff",
                        width: 160,
                        border: "1px solid rgba(255,255,255,0.04)",
                    }}
                />
            </div>

            {/* TABLE HEADER */}
            <div
                style={{
                    marginTop: 18,
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
                    padding: "10px 12px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    color: "#9fe8ff",
                    fontWeight: 700,
                    fontSize: 15,
                }}
            >
                <div>Duration</div>
                <div style={{ textAlign: "right" }}>Invested</div>
                <div style={{ textAlign: "right" }}>Value</div>
                <div style={{ textAlign: "right" }}>Return</div>
            </div>

            {/* TABLE ROWS */}
            {results.map((row) => (
                <div
                    key={row.years}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
                        padding: "12px 12px",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                >
                    <div style={{ color: "#bffaff", fontWeight: 700 }}>
                        {row.years} Year{row.years > 1 ? "s" : ""}
                    </div>
                    <div style={{ textAlign: "right" }}>{fmt(row.invested)}</div>
                    <div style={{ textAlign: "right", fontWeight: 800 }}>
                        {fmt(row.value)}
                    </div>
                    <div style={{ textAlign: "right" }}>{pct(row.annualizedReturn)}</div>
                </div>
            ))}

            <div style={{ marginTop: 10, color: "#8fdcff", fontSize: 13 }}>
                Note: Estimated based on selected fund's historical CAGR.
            </div>
        </div>
    );
}