import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import AMCSelector from "./components/AMCSelector";
import EDASection from "./components/EDASection";
import PredictionOutput from "./components/PredictionOutput";
import AlgorithmTable from "./components/AlgorithmTable";
import SIPCalculator from "./components/SIPCalculator";
import ChartSection from "./components/ChartSection";
import PieCharts from "./components/PieCharts";

import LOGO from "./assets/fund.png";
import "./styles.css";

export default function App() {
  const [amcList, setAmcList] = useState([]);
  const [selectedAMC, setSelectedAMC] = useState("");
  const [fundList, setFundList] = useState([]);
  const [fund, setFund] = useState("");

  const [eda, setEda] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/fund/amc-list")
      .then((res) => setAmcList(res.data || []));
  }, []);

  useEffect(() => {
    if (!selectedAMC) return;

    axios
      .get(`http://localhost:8080/api/fund/fund-list?name=${selectedAMC}`)
      .then((res) => setFundList(res.data || []));
  }, [selectedAMC]);

  async function loadEDA() {
    if (!fund) return alert("Select fund!");

    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/fund/by-fund?fund=${fund}`
      );

      setEda(res.data || {});
      setPredictionData(null);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  async function handlePredict() {
    if (!fund) return alert("Select fund!");

    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/fund/predict?fund=${fund}`
      );

      setPredictionData(res.data || {});
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  const dates = predictionData?.predictionDates || [];
  const predicted = predictionData?.prediction || [];
  const actual = eda?.history || [];
  const modelData = predictionData?.modelComparison || [];

  const nextNAV =
    predicted.length > 0 ? predicted[predicted.length - 1] : 0;

  // ---------------- PROFESSIONAL PDF GENERATOR ----------------

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    // -------- COVER PAGE --------
    pdf.setFontSize(26);
    pdf.setTextColor(0, 102, 204);
    pdf.text("Mutual Fund Performance Report", 105, 50, { align: "center" });

    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Fund: ${fund}`, 105, 70, { align: "center" });

    pdf.text(
      `Generated on: ${new Date().toLocaleString()}`,
      105,
      80,
      { align: "center" }
    );

    // Logo
    const logoImg = new Image();
    logoImg.src = LOGO;

    await new Promise((resolve) => {
      logoImg.onload = () => {
        pdf.addImage(logoImg, "PNG", 80, 10, 50, 30);
        resolve();
      };
    });

    // Watermark
    pdf.setTextColor(220, 220, 220);
    pdf.setFontSize(50);
    pdf.text("CONFIDENTIAL", 35, 180, { angle: 45 });

    pdf.addPage();

    // -------- DASHBOARD CONTENT --------
    const input = document.getElementById("reportContent");

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // -------- PAGE NUMBERS --------
    const totalPages = pdf.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(
        `Page ${i} of ${totalPages}`,
        105,
        290,
        { align: "center" }
      );
    }

    pdf.save(`${fund}_Professional_Report.pdf`);
  };

  return (
    <div className="page">
      <div className="container" id="reportContent">

        <div className="banner-wrap">
          <img src={LOGO} className="banner-img" alt="logo" />
        </div>

        <h1 className="app-title">
          Mutual Funds Performance Prediction
        </h1>

        <h3>Select AMC</h3>
        <AMCSelector
          selectedAMC={selectedAMC}
          onSelect={setSelectedAMC}
          amcList={amcList}
        />

        {selectedAMC && (
          <>
            <h3>Select Fund</h3>

            <select
              className="select"
              value={fund}
              onChange={(e) => setFund(e.target.value)}
            >
              <option value="">Choose Fund</option>
              {fundList.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>

            <button
              className="btn primary"
              onClick={loadEDA}
              style={{ marginTop: 10 }}
            >
              Load EDA
            </button>
          </>
        )}

        {loading && <p>Loading...</p>}

        {eda && (
          <>
            <EDASection eda={eda} />

            <button
              className="btn primary"
              onClick={handlePredict}
              style={{ marginTop: 20 }}
            >
              Predict Performance
            </button>
          </>
        )}

        {predictionData && (
          <>
            <PredictionOutput
              nextNAV={nextNAV}
              predictedDates={dates}
              history={actual}
            />

            <SIPCalculator
              selectedFund={{
                name: fund,
                history: actual,
                dates: dates,
              }}
              monthlySIP={2000}
            />

            <ChartSection
              actual={actual}
              predicted={predicted}
              dates={dates}
              modelData={modelData}
            />

            <PieCharts
              actual={actual}
              predicted={predicted}
              modelData={modelData}
            />

            <AlgorithmTable
              algorithms={predictionData.algorithms || []}
            />

            <div className="premium-card" style={{ marginTop: 30 }}>
              <h2>📄 Download  Report</h2>

              <button
                className="btn primary"
                onClick={handleDownloadPDF}
                style={{
                  marginTop: 20,
                  padding: "12px 20px",
                  fontSize: 16,
                  borderRadius: 8,
                }}
              >
                Download Full Professional PDF
              </button>
            </div>

          </>
        )}
      </div>
    </div>
  );
}