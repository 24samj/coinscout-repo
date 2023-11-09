import { Routes, Route } from "react-router-dom";
import CoinDetails from "./pages/CoinDetails/CoinDetails.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";

export default function App() {
  const [selectedCurrency, setSelectedCurrency] = useState("aed");
  const [masterData, setMasterData] = useState(null);
  const retrieveCoinData = async () => {
    try {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/`
      );
      setMasterData(data);
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    retrieveCoinData();
  }, []);

  return (
    <div className="App">
      <Navbar
        masterData={masterData}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              masterData={masterData}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
            />
          }
        />
        <Route
          path="/:coinId"
          element={
            <CoinDetails
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
            />
          }
        />
      </Routes>
    </div>
  );
}
