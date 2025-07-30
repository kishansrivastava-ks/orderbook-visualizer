import { useTheme } from "@/context/ThemeContext";

/**
 * A UI component that provides all the interactive controls for the visualizer.
 * This component is purely presentational; it receives its state and the functions
 * to update that state as props from its parent component (`AppContent`).
 *
 * @param {object} props - Contains all state values and setter functions.
 */
const ControlPanel = ({
  symbol,
  setSymbol,
  autoRotate,
  setAutoRotate,
  showPressureZones,
  setShowPressureZones,
  quantityThreshold,
  setQuantityThreshold,
  searchPrice,
  setSearchPrice,
  timeRange,
  setTimeRange,
  pressureZones, // A Set of pressure zone prices passed from the parent
}) => {
  const { theme, toggleTheme } = useTheme();

  // Convert the Set of pressure zones to an array for easier rendering with .map().
  const pressureZoneArray = Array.from(pressureZones);

  return (
    <div
      className={`absolute top-4 left-4 p-4 rounded-lg w-80 shadow-lg backdrop-blur-sm max-h-[95vh] overflow-y-auto ${
        theme === "dark"
          ? "bg-gray-900 bg-opacity-80 text-white border-gray-700"
          : "bg-white bg-opacity-80 text-black border-gray-300"
      }`}
    >
      <h1 className="text-xl font-bold mb-4 text-purple-400">
        GoQuant Visualizer
      </h1>

      {/* --- Main Controls Section --- */}
      <div className="space-y-4 border-b border-gray-700 pb-4 mb-4">
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium mb-1">
            Trading Pair
          </label>
          <select
            id="symbol"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          >
            <option value="btcusdt">BTC/USDT</option>
            <option value="ethusdt">ETH/USDT</option>
            <option value="bnbusdt">BNB/USDT</option>
            <option value="solusdt">SOL/USDT</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="auto-rotate" className="text-sm font-medium">
            Auto-Rotate
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="auto-rotate"
              className="sr-only peer"
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {/* --- Filters & Visualization Modes Section --- */}
      <div className="space-y-4 border-b border-gray-700 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-purple-300">
          Filters & Modes
        </h2>
        <div className="flex items-center justify-between">
          <label htmlFor="pressure-zones" className="text-sm font-medium">
            Show Pressure Zones
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="pressure-zones"
              className="sr-only peer"
              checked={showPressureZones}
              onChange={(e) => setShowPressureZones(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
        <div>
          <label
            htmlFor="quantity-threshold"
            className="block text-sm font-medium mb-1"
          >
            Min. Quantity Threshold: {quantityThreshold}
          </label>
          <input
            id="quantity-threshold"
            type="range"
            min="0"
            max="50"
            step="1"
            value={quantityThreshold}
            onChange={(e) => setQuantityThreshold(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label
            htmlFor="search-price"
            className="block text-sm font-medium mb-1"
          >
            Highlight Price Level
          </label>
          <input
            id="search-price"
            type="text"
            placeholder="e.g., 65000.50"
            value={searchPrice}
            onChange={(e) => setSearchPrice(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* --- Time Aggregation Section --- */}
      <div className="space-y-2 border-b border-gray-700 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-purple-400">
          Time Aggregation
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {["realtime", "1min", "5min", "15min", "1hr"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`p-2 text-sm rounded transition-colors ${
                timeRange === range
                  ? "bg-purple-600 text-white"
                  : `${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* --- Theme Toggle Section --- */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-4">
        <label htmlFor="theme-toggle" className="text-sm font-medium">
          {theme === "dark" ? "Dark Mode" : "Light Mode"}
        </label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="theme-toggle"
            className="sr-only peer"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
      </div>

      {/* --- Pressure Zone Stats Section --- */}
      {/* This section is conditionally rendered only if the feature is enabled and there are zones to display. */}
      {showPressureZones && pressureZoneArray.length > 0 && (
        <div className="border-b border-gray-700 pb-4 mb-4">
          <h2 className="text-lg font-semibold mb-2 text-purple-400">
            Pressure Zones
          </h2>
          <div className="space-y-1 text-xs">
            {pressureZoneArray.map((price) => (
              <div
                key={price}
                className="flex justify-between p-1 rounded bg-gray-700 bg-opacity-50"
              >
                <span>Price:</span>
                <span>{Number(price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Legend Section --- */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-purple-300">Legend</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2 border border-green-300"></div>
            <span>Bid (Buy Orders)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2 border border-red-300"></div>
            <span>Ask (Sell Orders)</span>
          </div>
          {/* Legend items are also rendered conditionally based on the current settings. */}
          {showPressureZones && (
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-fuchsia-500 mr-2 border border-fuchsia-300 shadow-[0_0_8px_#ff00ff]"></div>
              <span>Pressure Zone</span>
            </div>
          )}
          {searchPrice && (
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2 border border-yellow-200 shadow-[0_0_8px_#fbbf24]"></div>
              <span>Highlighted Price</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
