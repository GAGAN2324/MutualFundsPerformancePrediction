export default function AMCSelector({ selectedAMC, onSelect, amcList }) {
    return (
        <select
            value={selectedAMC}
            onChange={(e) => onSelect(e.target.value)}
            style={{
                width: "100%",
                padding: 12,
                background: "#0f172a",
                borderRadius: 8,
                border: "1px solid #123",
                color: "white",
            }}
        >
            <option value="">Select AMC</option>
            {amcList.map((amc) => (
                <option key={amc} value={amc}>
                    {amc}
                </option>
            ))}
        </select>
    );
}
