"use client";

import { useState, useEffect } from "react";

// Defines the maximum number of historical snapshots to store in memory.
const MAX_HISTORY_LENGTH = 100;

/**
 * A custom React hook to subscribe to real-time order book data from the Binance WebSocket API.
 * It manages the WebSocket connection lifecycle and stores a history of order book snapshots.
 *
 * @param {string} symbol - The trading symbol (e.g., 'btcusdt').
 * @param {string} timeRange - The data aggregation interval ('realtime', '1min', etc.).
 * @returns {Array} An array of historical order book snapshots.
 */

const useOrderbook = (symbol, timeRange) => {
  // State to hold the array of order book snapshots over time.
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Clear previous history whenever the symbol or time range changes.
    setHistory([]);

    // Determine the WebSocket stream's update speed based on the selected time range.
    // Binance offers different stream speeds for different levels of data aggregation.
    let updateSpeed;
    switch (timeRange) {
      case "1min":
        updateSpeed = "500ms";
        break;
      case "5min":
      case "15min":
      case "1hr":
        updateSpeed = "1000ms"; // Slower updates for aggregated views
        break;
      case "realtime":
      default:
        updateSpeed = "100ms"; // Fastest update for real-time view
        break;
    }

    // Establish a new WebSocket connection with the specified parameters.
    const ws = new WebSocket(
      `wss://fstream.binance.com/ws/${symbol}@depth20@${updateSpeed}`
    );

    // Handler for incoming messages from the WebSocket.
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Ensure the message contains valid bid (b) and ask (a) data.
        if (data.b && data.a) {
          setHistory((currentHistory) => {
            const newSnapshot = {
              bids: data.b,
              asks: data.a,
              timestamp: data.E, // Event time
            };

            // Prepend the new snapshot and slice the array to maintain MAX_HISTORY_LENGTH.
            // This is an immutable update that creates a new array.
            return [newSnapshot, ...currentHistory].slice(
              0,
              MAX_HISTORY_LENGTH
            );
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    // Error handler for the WebSocket connection.
    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    // Cleanup function: This is crucial for preventing memory leaks.
    // It runs when the component unmounts or when the dependencies (symbol, timeRange) change,
    // ensuring the old WebSocket connection is closed before a new one is established.
    ws.onclose = () => {
      console.log(
        `WebSocket disconnected for ${symbol} with ${timeRange} aggregation.`
      );
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [symbol, timeRange]); // Re-run the effect if the symbol or timeRange changes.

  return history;
};

export default useOrderbook;
