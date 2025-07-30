// In page.js

"use client";

import React, { useState } from "react";
import ControlPanel from "@/components/ControlPanel";
import Scene from "@/components/Scene";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

function AppContent() {
  const { theme } = useTheme();
  const [symbol, setSymbol] = useState("btcusdt");
  const [autoRotate, setAutoRotate] = useState(true);
  const [showPressureZones, setShowPressureZones] = useState(true);
  const [quantityThreshold, setQuantityThreshold] = useState(0);
  const [searchPrice, setSearchPrice] = useState("");
  const [timeRange, setTimeRange] = useState("realtime");
  const [pressureZones, setPressureZones] = useState(new Set());

  return (
    <main
      className={`w-full h-screen relative ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-200"
      }`}
    >
      <Scene
        symbol={symbol}
        autoRotate={autoRotate}
        showPressureZones={showPressureZones}
        quantityThreshold={quantityThreshold}
        searchPrice={searchPrice}
        timeRange={timeRange}
        setPressureZones={setPressureZones}
      />
      <ControlPanel
        symbol={symbol}
        setSymbol={setSymbol}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        showPressureZones={showPressureZones}
        setShowPressureZones={setShowPressureZones}
        quantityThreshold={quantityThreshold}
        setQuantityThreshold={setQuantityThreshold}
        searchPrice={searchPrice}
        setSearchPrice={setSearchPrice}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        pressureZones={pressureZones}
      />
    </main>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
