import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Tooltip as PriceTooltip } from "react-tooltip";
import axios from "axios";
import "./CoinDetails.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const CoinDetails = ({ selectedCurrency }) => {
    const { coinId } = useParams();
    const [coinData, setCoinData] = useState(null);
    const [prices, setPrices] = useState(null);
    const [activeTimeRange, setActiveTimeRange] = useState("1d");
    const [isCoinDataLoading, setIsCoinDataLoading] = useState(false);
    const [isPriceDataLoading, setIsPriceDataLoading] = useState(false);

    let labels;
    let data;
    let options;
    if (prices) {
        labels = prices.map((price) => new Date(price[0]).toDateString());
        data = {
            labels,
            datasets: [
                {
                    label: "Price",
                    data: prices.map((price) => price[1]),
                    borderColor: "orange",
                    backgroundColor: "rgb(20, 22, 25)",
                },
            ],
        };
        options = {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: "Coin price history",
                },
            },
        };
    }

    const fetchCoinData = async () => {
        try {
            setIsCoinDataLoading(true);
            const { data } = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${coinId}`
            );
            setCoinData(data);
        } catch (ex) {
            console.log(ex);
        } finally {
            setIsCoinDataLoading(false);
        }
    };

    const fetchPrices = async (timeRange) => {
        try {
            setIsPriceDataLoading(true);
            const { data } = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${selectedCurrency}&days=${timeRange}`
            );
            setPrices(data.prices);
        } catch (ex) {
            console.log(ex);
        } finally {
            setIsPriceDataLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchCoinData();
                await fetchPrices(activeTimeRange);
            } catch (ex) {
                console.log(ex);
            }
        };

        fetchData();
    }, [coinId, activeTimeRange, selectedCurrency]);

    return (
        <>
            {isCoinDataLoading ? (
                <div className="loadingContainer coinDataLoading">
                    Loading Coin Data...
                </div>
            ) : (
                <div className="coinDetailsContainer d-flex">
                    <div className="coinData p-3">
                        <div className="coinImg">
                            <img src={coinData?.image?.large} alt="" />
                        </div>
                        <div className="coinName mt-3">{coinData?.name}</div>
                        <div className="coinInfo p-1 mt-2">
                            {coinData?.description.en.split(". ")[0] + "."}
                        </div>

                        <div className="coinRank p-1 mt-3 d-flex justify-content-between">
                            <strong>Rank:</strong>
                            <div>{coinData?.market_cap_rank}</div>
                        </div>
                        <div className="coinPrice p-1 mt-1 d-flex justify-content-between">
                            <strong>Current Price:</strong>
                            <div>
                                {Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: selectedCurrency,
                                }).format(
                                    coinData?.market_data.current_price[
                                        selectedCurrency
                                    ]
                                )}
                            </div>
                        </div>
                        <div className="coinCap p-1 mt-1 d-flex justify-content-between">
                            <strong>Market Cap:</strong>
                            <div
                                data-tooltip-id="price-tooltip"
                                data-tooltip-content={Intl.NumberFormat(
                                    "en-IN",
                                    {
                                        style: "currency",
                                        currency: selectedCurrency,
                                    }
                                ).format(
                                    coinData?.market_data.market_cap[
                                        selectedCurrency
                                    ]
                                )}>
                                {Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: selectedCurrency,
                                    notation: "compact",
                                }).format(
                                    coinData?.market_data.market_cap[
                                        selectedCurrency
                                    ]
                                )}
                            </div>
                            <PriceTooltip id="price-tooltip" place="bottom" />
                        </div>
                    </div>

                    <div className="chartData">
                        {isPriceDataLoading ? (
                            <div className="loadingContainer priceDataLoading">
                                Loading Price Data...
                            </div>
                        ) : (
                            <>
                                {data && (
                                    <div className="chart">
                                        <Line options={options} data={data} />
                                    </div>
                                )}

                                <div className="chart-buttons d-flex justify-content-center my-2">
                                    <button
                                        className={`${
                                            activeTimeRange === "1d"
                                                ? "active-time-button"
                                                : "time-button"
                                        }`}
                                        onClick={() =>
                                            setActiveTimeRange("1d")
                                        }>
                                        24 Hours
                                    </button>
                                    <button
                                        className={`${
                                            activeTimeRange === "30d"
                                                ? "active-time-button"
                                                : "time-button"
                                        }`}
                                        onClick={() =>
                                            setActiveTimeRange("30d")
                                        }>
                                        30 Days
                                    </button>
                                    <button
                                        className={`${
                                            activeTimeRange === "90d"
                                                ? "active-time-button"
                                                : "time-button"
                                        }`}
                                        onClick={() =>
                                            setActiveTimeRange("90d")
                                        }>
                                        3 Months
                                    </button>

                                    <button
                                        className={`${
                                            activeTimeRange === "365d"
                                                ? "active-time-button"
                                                : "time-button"
                                        }`}
                                        onClick={() =>
                                            setActiveTimeRange("365d")
                                        }>
                                        1 Year
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default CoinDetails;
