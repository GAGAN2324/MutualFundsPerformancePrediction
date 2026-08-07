

const models = [
    {
        rank: 1,
        name: "LINEAR",
        accuracy: 99.47,
        rating: "5 / 5 · Best Model",
        color: "#20d489",
        medal: "#f5c542",
    },
    {
        rank: 2,
        name: "DRIFT",
        accuracy: 95.64,
        rating: "4 / 5 · Good",
        color: "#35a7ff",
        medal: "#d9dde5",
    },
    {
        rank: 3,
        name: "RF",
        accuracy: 94.80,
        rating: "3 / 5 · Good",
        color: "#ff5d67",
        medal: "#d18a52",
    },
];

export default function AccuracyLeaderboard() {
    return (
        <div className="accuracy-card">
            <h2 className="accuracy-title">Accuracy by Model</h2>

            {models.map((model) => (
                <div className="accuracy-row" key={model.rank}>
                    <div
                        className="rank-circle"
                        style={{ background: model.medal }}
                    >
                        {model.rank}
                    </div>

                    <div className="accuracy-info">
                        <div className="accuracy-top">
                            <span className="model-name">{model.name}</span>

                            <span className="accuracy-value">
                {model.accuracy}%
              </span>
                        </div>

                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${model.accuracy}%`,
                                    background: model.color,
                                }}
                            ></div>
                        </div>

                        <div className="rating-text">
                            {model.rating}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}