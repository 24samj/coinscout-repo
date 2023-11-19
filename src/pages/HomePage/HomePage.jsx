import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar.jsx";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = ({
    masterData,
    selectedCurrency,
    setSelectedCurrency,
    isTableDataLoading,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("Rank");

    const navigate = useNavigate();

    const filteredData =
        masterData &&
        masterData
            .filter(
                (coin) =>
                    coin.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    coin.symbol
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                switch (sortOption) {
                    case "Rank":
                        return a.market_cap_rank - b.market_cap_rank;
                    case "Name":
                        return a.name.localeCompare(b.name);
                    case "Price":
                        return (
                            b.market_data.current_price[selectedCurrency] -
                            a.market_data.current_price[selectedCurrency]
                        );
                    case "24h Change":
                        return (
                            b.market_data.price_change_percentage_24h -
                            a.market_data.price_change_percentage_24h
                        );
                    case "Market Cap":
                        return (
                            b.market_data.market_cap[selectedCurrency] -
                            a.market_data.market_cap[selectedCurrency]
                        );
                    default:
                        return 0;
                }
            });

    return (
        <>
            <h1 className="intro mt-4 mb-4">
                Cryptocurrency Prices by {sortOption}
            </h1>
            <div className="d-flex justify-content-center">
                <div className="searchAndSort d-flex justify-content-between align-items-center">
                    <div class="input-group">
                        <input
                            className="searchBar w-50 p-2"
                            type="text"
                            class="form-control"
                            placeholder="Search by coin name"
                            aria-label="Search by coin name"
                            aria-describedby="button-addon2"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                        />
                        {searchQuery && (
                            <button
                                class="clearBtn btn btn-outline-secondary"
                                type="button"
                                id="button-addon2"
                                onClick={() => setSearchQuery("")}>
                                ❌
                            </button>
                        )}
                    </div>

                    <select
                        className="sortSelect p-2"
                        name="sort"
                        id="sort"
                        value={sortOption}
                        onChange={(event) => setSortOption(event.target.value)}>
                        <option value="Rank">Rank</option>
                        <option value="Name">Name</option>
                        <option value="Price">Price</option>
                        <option value="24h Change">24h Change</option>
                        <option value="Market Cap">Market Cap</option>
                    </select>
                </div>
            </div>
            <div className="coinTableContainer d-flex justify-content-center">
                {isTableDataLoading ? (
                    "Loading..."
                ) : (
                    <table className="coinTable">
                        <thead>
                            <tr className="topRow border-bottom">
                                <th></th>
                                <th className="text-start">Coin</th>
                                <th>Price</th>
                                <th>24h Change</th>
                                <th className="text-end">Market Cap</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData &&
                                filteredData.map((coin) => (
                                    <tr
                                        key={coin.id}
                                        className="border-bottom"
                                        onClick={() => navigate(`/${coin.id}`)}>
                                        <td className="logo-col">
                                            <div className="coinImg">
                                                <img
                                                    src={coin.image.small}
                                                    alt="Coin Image"
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="coinInfo d-flex">
                                                <div className="basicInfo">
                                                    <div className="symbol d-flex">
                                                        {coin.symbol.toUpperCase()}
                                                    </div>
                                                    <div className="name">
                                                        {coin.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {selectedCurrency.toUpperCase()}{" "}
                                            {
                                                coin.market_data.current_price[
                                                    selectedCurrency
                                                ]
                                            }
                                        </td>
                                        <td
                                            className={`${
                                                coin.market_data
                                                    .price_change_percentage_24h >=
                                                0
                                                    ? "positive"
                                                    : "negative"
                                            }`}>
                                            {coin.market_data.price_change_percentage_24h.toFixed(
                                                2
                                            )}
                                            %
                                        </td>
                                        <td className="text-end">
                                            {selectedCurrency.toUpperCase()}{" "}
                                            {
                                                coin.market_data.market_cap[
                                                    selectedCurrency
                                                ]
                                            }
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};
export default HomePage;
