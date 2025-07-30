"use client";

import { useState, useEffect } from "react";

const MAX_HISTORY_LENGTH = 100;

const useOrderbook = (symbol, timeRange) => {
  // Accept timeRange as a prop
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory([]);

    // NEW: Determine update speed based on the selected timeRange
    let updateSpeed;
    switch (timeRange) {
      case "1min":
        updateSpeed = "500ms";
        break;
      case "5min":
      case "15min":
      case "1hr":
        updateSpeed = "1000ms";
        break;
      case "realtime":
      default:
        updateSpeed = "100ms";
        break;
    }

    const ws = new WebSocket(
      `wss://fstream.binance.com/ws/${symbol}@depth20@${updateSpeed}`
    );

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.b && data.a) {
          setHistory((currentHistory) => {
            const newSnapshot = {
              bids: data.b,
              asks: data.a,
              timestamp: data.E,
            };
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

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

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
  }, [symbol, timeRange]); // The effect now re-runs if symbol OR timeRange changes

  return history;
};

export default useOrderbook;
