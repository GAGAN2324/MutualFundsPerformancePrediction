import React, { useState, useRef, useEffect } from "react";

export default function AIChat({ data, onClose }) {
    const [messages, setMessages] = useState([
        { sender: "ai", text: "Hello! I'm your Fund Assistant. Ask anything about trends, models, SIP, or predictions." }
    ]);

    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const windowRef = useRef(null);

    useEffect(() => {
        if (windowRef.current) {
            windowRef.current.scrollTop = windowRef.current.scrollHeight;
        }
    }, [messages, typing]);

    function addMessage(sender, text) {
        setMessages((prev) => [...prev, { sender, text }]);
    }

    function generateAIResponse(question) {
        if (!data) return "Please run prediction first.";

        const predicted = Array.isArray(data.predicted) ? data.predicted : [];
        const history = Array.isArray(data.history) ? data.history : [];
        const algorithms = data.algorithms && typeof data.algorithms === "object"
            ? data.algorithms
            : {};
        const modelComparison = Array.isArray(data.modelComparison)
            ? data.modelComparison
            : [];

        if (predicted.length === 0 || history.length === 0) {
            return "I don't have enough data yet to answer that. Try running a prediction first.";
        }

        const lastNav = predicted[predicted.length - 1];
        const firstNavEntry = history[0];
        const firstNav = typeof firstNavEntry === "object" && firstNavEntry !== null
            ? firstNavEntry.nav
            : firstNavEntry;

        if (firstNav === undefined || firstNav === null || firstNav === 0 || isNaN(firstNav)) {
            return "I couldn't compute a trend from the available NAV history.";
        }

        const growth = (((lastNav - firstNav) / firstNav) * 100).toFixed(2);

        const algoKeys = Object.keys(algorithms);
        // Backend returns each algorithm's "accuracy" (higher is better),
        // not "mape" -- compare on that field, keeping the highest.
        const bestModel = algoKeys.length > 0
            ? algoKeys.reduce((best, curr) => {
                const bestAcc = algorithms[best]?.accuracy;
                const currAcc = algorithms[curr]?.accuracy;
                if (bestAcc === undefined) return curr;
                if (currAcc === undefined) return best;
                return currAcc > bestAcc ? curr : best;
            }, algoKeys[0])
            : null;

        const responses = {
            trend: `The fund shows a ${growth > 0 ? "positive" : "negative"} trend of ${growth}%. Latest predicted NAV = ${lastNav}.`,
            best: bestModel
                ? `${bestModel.toUpperCase()} is the best model here, with the highest accuracy (${algorithms[bestModel]?.accuracy ?? "N/A"}%) on this fund.`
                : "I don't have model comparison data to determine the best model.",
            model: bestModel
                ? `${bestModel.toUpperCase()} fits the dataset best.`
                : "I don't have model comparison data available right now.",
            sip: `SIP looks ${growth > 0 ? "favorable" : "risky"} based on long-term trend.`,
            volatility: `Volatility is ${modelComparison.length > 10 ? "moderate" : "low"} based on NAV variation.`,
            summary: `Trend: ${growth}%. Best: ${bestModel ? bestModel.toUpperCase() : "N/A"}. Predicted NAV: ${lastNav}.`
        };

        const q = question.toLowerCase();
        if (q.includes("trend")) return responses.trend;
        if (q.includes("best")) return responses.best;
        if (q.includes("model")) return responses.model;
        if (q.includes("sip")) return responses.sip;
        if (q.includes("volatility")) return responses.volatility;
        if (q.includes("summary")) return responses.summary;

        return "Ask about: trend, best model, SIP, volatility, or summary.";
    }

    function handleSend() {
        if (!input.trim()) return;
        const question = input.trim();

        addMessage("user", question);
        setInput("");

        setTyping(true);

        setTimeout(() => {
            addMessage("ai", generateAIResponse(question));
            setTyping(false);
        }, 600);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            handleSend();
        }
    }

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <span>🤖 AI Fund Assistant</span>
                <button className="chatbot-close" onClick={onClose}>✖</button>
            </div>

            <div className="chat-window" ref={windowRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-msg ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}

                {typing && <div className="typing">AI is typing...</div>}
            </div>

            <div className="chat-input-row">
                <input
                    className="chat-input"
                    placeholder="Type your question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="chat-send-btn" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}