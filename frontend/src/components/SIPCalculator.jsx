import React, { useMemo, useState, useEffect } from "react";

export default function SIPCalculator({
                                          selectedFund = null,
                                          monthlySIP = 2000,
                                          durations = [1, 3, 5],
                                      }) {
    const [sipAmount, setSipAmount] = useState(monthlySIP);

    const fundName =
        selectedFund?.name ||
        selectedFund?.fundName ||
        selectedFund?.model ||
        selectedFund?.fund ||
        "No fund selected";

    // ---------------- EXPECTED RETURN FROM PREDICTION ----------------
    const expectedAnnualReturn = useMemo(() => {
        if (!selectedFund) return 0;

        const pred = selectedFund.prediction || [];
        if (pred.length < 2) return 0;

        const first = Number(pred[0]);
        const last = Number(pred[pred.length - 1]);
        if (!isFinite(first) || first <= 0) return 0;

        const months = pred.length - 1;
        const years = months / 12;
        if (years <= 0) return 0;

        const derived = Math.pow(last / first, 1 / years) - 1;
        return isFinite(derived) ? derived : 0;
    }, [selectedFund]);

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

    const results = useMemo(() => {
        return durations.map((yr) => ({
            years: yr,
            ...calcSIP(sipAmount, yr, expectedAnnualReturn),
        }));
    }, [sipAmount, expectedAnnualReturn]);

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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ color: "#00eaff" }}>💰 SIP Calculator</h3>

                <div style={{ textAlign: "right", color: "#9fe8ff" }}>
                    <div><strong>Fund:</strong> {fundName}</div>
                    <div>Expected Return: {pct(expectedAnnualReturn)}</div>
                </div>
            </div>

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
                Note: Estimated based on selected fund's 6-month predicted NAV trend.
            </div>
        </div>
    );
}