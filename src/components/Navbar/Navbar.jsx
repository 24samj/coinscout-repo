import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ masterData, selectedCurrency, setSelectedCurrency }) => {
    const [coinList, setCoinList] = useState(null);
    const navigate = useNavigate();
    const setCurrencies = () => {
        if (masterData && masterData.length > 0) {
            const currObj = masterData[0].market_data.current_price;
            setCoinList(currObj);
        }
    };
    useEffect(() => {
        setCurrencies();
    }, [masterData]);
    return (
        <>
            <div className="header d-flex justify-content-between align-items-center">
                <div onClick={() => navigate("/")} className="siteText">
                    CoinScout
                </div>
                <select
                    onChange={(event) =>
                        setSelectedCurrency(event.target.value)
                    }
                    className="currencySelect d-flex justify-content-center align-items-center"
                    id="">
                    {Object.keys(coinList || {}).map((currencyCode) => (
                        <option value={currencyCode}>
                            {currencyCode.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};
export default Navbar;
