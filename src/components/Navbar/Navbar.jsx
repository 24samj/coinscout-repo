import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "./Navbar.css";

const Navbar = ({
    currencyList,
    selectedCurrency,
    setSelectedCurrency,
    isTableDataLoading,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <div className="header d-flex justify-content-between align-items-center">
                <div className="logo-back-container d-flex justify-content-center align-items-center">
                    {location.pathname !== "/" && (
                        <>
                            <div
                                className="back-btn"
                                onClick={() => navigate("/")}
                                data-tooltip-id="back-tooltip"
                                data-tooltip-content="Go Back">
                                ←
                            </div>
                            <Tooltip id="back-tooltip" />
                        </>
                    )}
                    <div
                        className="siteText"
                        style={
                            location.pathname !== "/"
                                ? { marginLeft: "1vw" }
                                : { marginLeft: "12.5vw" }
                        }>
                        CoinScout
                    </div>
                </div>

                <select
                    value={selectedCurrency}
                    onChange={(event) =>
                        setSelectedCurrency(event.target.value)
                    }
                    className="currencySelect d-flex justify-content-center align-items-center"
                    id="currSelect">
                    {isTableDataLoading ? (
                        <option value={selectedCurrency}>
                            {selectedCurrency.toUpperCase()}
                        </option>
                    ) : (
                        Object.keys(
                            currencyList || { selectedCurrency: "1" }
                        ).map((currencyCode) => (
                            <option key={currencyCode} value={currencyCode}>
                                {currencyCode.toUpperCase()}
                            </option>
                        ))
                    )}
                </select>
            </div>
        </>
    );
};
export default Navbar;
