import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import CoinDetails from "./pages/CoinDetails/CoinDetails.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";

export default function App() {
    const location = useLocation();

    useEffect(() => {
        const pageTitle = getPageTitle(location.pathname);
        document.title = `CoinScout | ${
            location.pathname === "/" ? "Homepage" : pageTitle + " Details"
        }`;
    }, [location.pathname]);

    const getPageTitle = (pathname) => {
        const parts = pathname.split("/");
        const lastPart = parts[parts.length - 1];

        const capitalizedLastPart =
            lastPart.charAt(0).toUpperCase() + lastPart.slice(1);

        return capitalizedLastPart;
    };

    const [selectedCurrency, setSelectedCurrency] = useState("inr");
    const [currencyList, setCurrencyList] = useState({});
    const [masterData, setMasterData] = useState(null);
    const [isTableDataLoading, setIsTableDataLoading] = useState(false);

    useEffect(() => {
        const retrieveCoinData = async () => {
            try {
                setIsTableDataLoading(true);
                const { data } = await axios.get(
                    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${selectedCurrency}`
                );
                setMasterData(data);
            } catch (ex) {
                console.log("Master data could not be retrieved: ", ex);
            } finally {
                setIsTableDataLoading(false);
            }
        };

        retrieveCoinData();
    }, [selectedCurrency]);

    const retrieveCurrencyList = async () => {
        try {
            const { data } = await axios.get(
                "https://api.coingecko.com/api/v3/coins/bitcoin"
            );
            setCurrencyList(data.market_data.current_price);
        } catch (ex) {
            console.log("Currency list could not be retrieved: ", ex);
        }
    };

    useEffect(() => {
        retrieveCurrencyList();
    }, []);

    return (
        <div className="App">
            <Navbar
                currencyList={currencyList}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                isTableDataLoading={isTableDataLoading}
            />
            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            masterData={masterData}
                            selectedCurrency={selectedCurrency}
                            setSelectedCurrency={setSelectedCurrency}
                            isTableDataLoading={isTableDataLoading}
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
