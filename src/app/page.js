// In page.js

"use client";

import React, { useState } from "react";
import ControlPanel from "@/components/ControlPanel";
import Scene from "@/components/Scene";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

/**
 * AppContent serves as the main container for the application, managing the
 * state for all interactive components and passing it down as props.
 */
function AppContent() {
  const { theme } = useTheme();

  // --- Centralized State Management ---
  // All state variables that control the visualization and UI are managed here
  // to ensure a single source of truth.

  const [symbol, setSymbol] = useState("btcusdt");
  const [autoRotate, setAutoRotate] = useState(true);
  const [showPressureZones, setShowPressureZones] = useState(true);
  const [quantityThreshold, setQuantityThreshold] = useState(0);
  const [searchPrice, setSearchPrice] = useState("");
  const [timeRange, setTimeRange] = useState("realtime");

  // This state holds the identified pressure zone prices. It is managed here but
  // calculated and updated by the `Scene` component, demonstrating a pattern of
  // child-to-parent state communication.
  const [pressureZones, setPressureZones] = useState(new Set());

  return (
    <main
      className={`w-full h-screen relative ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-200"
      }`}
    >
      {/* The 3D visualization component. It receives state for rendering but also updates the pressureZones state. */}
      <Scene
        symbol={symbol}
        autoRotate={autoRotate}
        showPressureZones={showPressureZones}
        quantityThreshold={quantityThreshold}
        searchPrice={searchPrice}
        timeRange={timeRange}
        setPressureZones={setPressureZones}
      />

      {/* The UI panel for user controls. It receives state and functions to modify that state. */}
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

/**
 * The root component of the application. Its primary role is to wrap the
 * entire app in the ThemeProvider, making the theme context available
 * to all child components.
 */
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
