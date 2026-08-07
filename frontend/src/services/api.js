import axios from "axios";

const api = axios.create({
    baseURL: "https://mutualfundsperformanceprediction-production.up.railway.app/api/fund",
});

export default api;