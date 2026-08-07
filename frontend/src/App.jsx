import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import api from "./services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import Nav from "./components/Nav";
import AIChat from "./components/AIChat";

import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Analytics from "./pages/Analytics";
import ModelComparisonPage from "./pages/ModelComparisonPage";
import UnderstandingModels from "./pages/UnderstandingModels";
import SIP from "./pages/SIP";
import About from "./pages/About";

import LOGO from "./assets/fund.png";
import "./styles.css";

/**
 * Layout holds every bit of state and every handler that used to live
 * directly in App.jsx. Nothing about the logic changed — it's the same
 * useEffect calls, the same api.get(...) calls, the same PDF export code.
 * It's just now shared across routed pages via <Outlet context={...} />
 * instead of being rendered inline in one long page.
 */
function Layout() {
  const [amcList, setAmcList] = useState([]);
  const [selectedAMC, setSelectedAMC] = useState("");
  const [fundList, setFundList] = useState([]);
  const [fund, setFund] = useState("");

  const [eda, setEda] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);

  // AI Chatbot visibility
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    api
      .get("/amc-list")
      .then((res) => setAmcList(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedAMC) return;

    api
      .get(`/fund-list?name=${selectedAMC}`)
      .then((res) => setFundList(res.data || []))
      .catch((err) => console.error(err));
  }, [selectedAMC]);

  async function loadEDA() {
    if (!fund) return alert("Select fund!");

    setLoading(true);

    try {
      const res = await api.get(`/by-fund?fund=${fund}`);
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
      const res = await api.get(`/predict?fund=${fund}`);
      setPredictionData(res.data || {});
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  // FIX: eda's historical NAV array is "navValues", not "history".
  // Fallback to "history" kept in case backend shape changes back.
  const dates = predictionData?.predictionDates || [];
  const predicted = predictionData?.prediction || [];
  const actual = eda?.navValues || eda?.history || [];
  const historyDates = eda?.dates || [];
  const modelData = predictionData?.modelComparison || [];

  const nextNAV =
    predicted.length > 0 ? predicted[predicted.length - 1] : 0;

  // ---- Data normalization for AIChat ----
  const algorithmsObj = (eda?.algorithms || []).reduce((acc, algo) => {
    const key = (algo?.name || algo?.model || "").toString().toLowerCase();
    if (key) acc[key] = algo;
    return acc;
  }, {});

  const chatHistory = actual.map((v) =>
    typeof v === "object" && v !== null ? v : { nav: v }
  );

  const chatData =
    predictionData && eda
      ? {
          predicted,
          history: chatHistory,
          algorithms: algorithmsObj,
          modelComparison: modelData,
        }
      : null;

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    pdf.setFontSize(26);
    pdf.setTextColor(0, 102, 204);
    pdf.text("Mutual Fund Performance Report", 105, 50, {
      align: "center",
    });

    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Fund: ${fund}`, 105, 70, {
      align: "center",
    });

    pdf.text(
      `Generated on: ${new Date().toLocaleString()}`,
      105,
      80,
      { align: "center" }
    );

    const logoImg = new Image();
    logoImg.src = LOGO;

    await new Promise((resolve) => {
      logoImg.onload = () => {
        pdf.addImage(logoImg, "PNG", 80, 10, 50, 30);
        resolve();
      };
    });

    pdf.setTextColor(220, 220, 220);
    pdf.setFontSize(50);
    pdf.text("CONFIDENTIAL", 35, 180, { angle: 45 });

    pdf.addPage();

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

    const totalPages = pdf.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Page ${i} of ${totalPages}`, 105, 290, {
        align: "center",
      });
    }

    pdf.save(`${fund}_Professional_Report.pdf`);
  };

  const outletContext = {
    amcList,
    selectedAMC,
    setSelectedAMC,
    fundList,
    fund,
    setFund,
    eda,
    predictionData,
    loading,
    loadEDA,
    handlePredict,
    handleDownloadPDF,
    dates,
    predicted,
    actual,
    historyDates,
    modelData,
    nextNAV,
  };

  return (
    <div className="page">
      <div className="container">
        <div className="banner-wrap">
          <img src={LOGO} className="banner-img" alt="logo" />
        </div>

        <h1 className="app-title">Mutual Funds Performance Prediction</h1>

        <Nav />

        <Outlet context={outletContext} />
      </div>

      {/* AI Chatbot lives outside the routed pages so it stays available
          everywhere once a prediction has been run — same as before. */}
      {predictionData && (
        <>
          <button
            className="chatbot-fab"
            onClick={() => setShowChat(true)}
            aria-label="Open AI Fund Assistant"
            title="Ask the AI Fund Assistant"
          >
            🤖
          </button>

          {showChat && (
            <AIChat data={chatData} onClose={() => setShowChat(false)} />
          )}
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/model-comparison" element={<ModelComparisonPage />} />
          <Route path="/sip-calculator" element={<SIP />} />
          <Route path="/understanding-models" element={<UnderstandingModels />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
