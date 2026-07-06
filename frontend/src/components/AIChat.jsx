import React, { useState } from "react";

export default function AIChat({ data, onClose }) {
    const [messages, setMessages] = useState([
        { sender: "ai", text: "Hello! I'm your Fund Assistant. Ask anything about trends, models, SIP, or predictions." }
    ]);

    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);

    function addMessage(sender, text) {
        setMessages(prev => [...prev, { sender, text }]);
    }

    function generateAIResponse(question) {
        if (!data) return "Please run prediction first.";

        const lastNav = data.predicted[data.predicted.length - 1];
        const firstNav = data.history[0].nav;
        const growth = (((lastNav - firstNav) / firstNav) * 100).toFixed(2);

        const algorithms = data.algorithms;
        const bestModel = Object.keys(algorithms).reduce((best, curr) =>
            algorithms[curr].mape < algorithms[best].mape ? curr : best
        );

        const responses = {
            trend: `The fund shows a ${growth > 0 ? "positive" : "negative"} trend of ${growth}%. Latest predicted NAV = ${lastNav}.`,
            best: `${bestModel.toUpperCase()} is the best model due to lowest MAPE and stable pattern.`,
            model: `${bestModel.toUpperCase()} fits the dataset best.`,
            sip: `SIP looks ${growth > 0 ? "favorable" : "risky"} based on long-term trend.`,
            volatility: `Volatility is ${data.modelComparison.length > 10 ? "moderate" : "low"} based on NAV variation.`,
            summary: `Trend: ${growth}%. Best: ${bestModel}. Predicted NAV: ${lastNav}.`
        };

        question = question.toLowerCase();
        if (question.includes("trend")) return responses.trend;
        if (question.includes("best")) return responses.best;
        if (question.includes("model")) return responses.model;
        if (question.includes("sip")) return responses.sip;
        if (question.includes("volatility")) return responses.volatility;
        if (question.includes("summary")) return responses.summary;

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

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <span>🤖 AI Fund Assistant</span>
                <button className="chatbot-close" onClick={onClose}>✖</button>
            </div>

            <div className="chat-window">
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
                />
                <button className="chat-send-btn" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}
