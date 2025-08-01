import useOrderbook from "@/hooks/useOrderbook";
import { useMemo, useState } from "react";
import { Grid, OrbitControls, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import RotatingGroup from "./RotatingGroup";
import Bar from "./Bar";
import { useTheme } from "@/context/ThemeContext";

// --- Constants ---
const Z_SPACING = 0.5; // Spacing between historical snapshots along the Z-axis.

// --- Theme Color Definitions ---
const darkThemeColors = {
  bid: "#10b981",
  ask: "#ef4444",
  bidPressure: "#2dd4bf",
  askPressure: "#f472b6",
  highlight: "#facc15",
  textPrimary: "#e5e7eb",
  textSecondary: "#9ca3b0",
  grid: "#4b5563",
  background: "#1f2937",
};

const lightThemeColors = {
  bid: "#16a34a",
  ask: "#dc2626",
  bidPressure: "#0d9488",
  askPressure: "#e11d48",
  highlight: "#f59e0b",
  textPrimary: "#1f2937",
  textSecondary: "#4b5563",
  grid: "#9ca3b0",
  background: "#e5e7eb",
};

// --- Sub-components ---

/**
 * Renders price tick markers along the X-axis for better readability.
 */
const PriceTicks = ({ bids, asks, centerPrice }) => {
  // Display a tick for every 5th order to avoid clutter.
  const bidTicks = bids.filter((_, i) => i > 0 && i % 5 === 0);
  const askTicks = asks.filter((_, i) => i > 0 && i % 5 === 0);

  return (
    <group>
      {[...bidTicks, ...askTicks].map((order) => (
        <Text
          key={`tick-${order.price}`}
          position={[order.price - centerPrice, -1.0, 0]}
          fontSize={0.5}
          color={darkThemeColors.textSecondary}
          anchorX="center"
          anchorY="middle"
        >
          {order.price.toFixed(2)}
        </Text>
      ))}
    </group>
  );
};

/**
 * Displays a text label with price and quantity when hovering over a bar.
 */
const HoverInfo = ({ data, centerPrice, colors }) => {
  if (!data) return null;

  return (
    <Text
      position={[data.price - centerPrice, data.cumulativeQuantity + 2, 0]}
      fontSize={0.6}
      color={colors.textPrimary}
      backgroundColor={colors.background}
      padding={0.2}
      borderRadius={0.1}
      anchorX="center"
    >
      {`Price: ${data.price.toFixed(2)}\nQty: ${data.cumulativeQuantity.toFixed(
        2
      )}`}
    </Text>
  );
};

/**
 * The main 3D Scene component. It fetches order book data, processes it for visualization,
 * and renders the entire 3D environment using React Three Fiber.
 */
const Scene = ({
  symbol,
  autoRotate,
  showPressureZones,
  quantityThreshold,
  searchPrice,
  timeRange,
  setPressureZones,
}) => {
  const { theme } = useTheme();
  const COLORS = theme === "dark" ? darkThemeColors : lightThemeColors;

  // Fetch real-time data using the custom hook.
  const history = useOrderbook(symbol, timeRange);
  const [hoveredData, setHoveredData] = useState(null);

  // Memoize the entire data processing pipeline. This is critical for performance,
  // as it prevents expensive calculations on every re-render. The block only re-runs
  // when its dependencies (e.g., `history`, `quantityThreshold`) change.
  const processedData = useMemo(() => {
    if (!history || history.length === 0) return { snapshots: [] };

    const latest = history[0];
    if (!latest.bids?.[0] || !latest.asks?.[0]) return { snapshots: [] };

    // 1. Filter the latest snapshot by the user-defined quantity threshold.
    const filteredBidsRaw = latest.bids.filter(
      (b) => parseFloat(b[1]) >= quantityThreshold
    );
    const filteredAsksRaw = latest.asks.filter(
      (a) => parseFloat(a[1]) >= quantityThreshold
    );

    if (filteredBidsRaw.length === 0 || filteredAsksRaw.length === 0) {
      return { snapshots: [] };
    }

    // 2. Calculate the center price to keep the visualization centered.
    const highestBid = parseFloat(filteredBidsRaw[0][0]);
    const lowestAsk = parseFloat(filteredAsksRaw[0][0]);
    const centerPrice = (highestBid + lowestAsk) / 2;

    // 3. Calculate cumulative depth for the latest snapshot. This creates the "wall" effect.
    let cumulativeBidQty = 0;
    const latestBids = [...filteredBidsRaw]
      .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
      .map((b) => {
        const price = parseFloat(b[0]);
        const quantity = parseFloat(b[1]);
        cumulativeBidQty += quantity;
        return { price, quantity, cumulativeQuantity: cumulativeBidQty };
      });

    let cumulativeAskQty = 0;
    const latestAsks = [...filteredAsksRaw]
      .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
      .map((a) => {
        const price = parseFloat(a[0]);
        const quantity = parseFloat(a[1]);
        cumulativeAskQty += quantity;
        return { price, quantity, cumulativeQuantity: cumulativeAskQty };
      });

    // 4. Identify pressure zones by finding the top 5 levels with the highest volume.
    let pressureZones = new Set();
    if (showPressureZones) {
      const allOrders = [...latestBids, ...latestAsks].sort(
        (a, b) => b.quantity - a.quantity
      );
      pressureZones = new Set(allOrders.slice(0, 5).map((p) => p.price));
    }

    // 5. Process historical data for the "ghost" trail effect.
    const processedHistory = history.slice(1).map((snapshot) => ({
      timestamp: snapshot.timestamp,
      bids: snapshot.bids
        .map((b) => ({ price: parseFloat(b[0]), quantity: parseFloat(b[1]) }))
        .filter((b) => b.quantity >= quantityThreshold),
      asks: snapshot.asks
        .map((a) => ({ price: parseFloat(a[0]), quantity: parseFloat(a[1]) }))
        .filter((a) => a.quantity >= quantityThreshold),
    }));

    // Update the parent component's state with the newly calculated pressure zones.
    setPressureZones(pressureZones);

    return {
      centerPrice,
      pressureZones,
      latestBids,
      latestAsks,
      highlightedPrice: parseFloat(searchPrice) || null,
      processedHistory,
    };
  }, [
    history,
    showPressureZones,
    quantityThreshold,
    searchPrice,
    setPressureZones,
  ]);

  const {
    centerPrice,
    pressureZones,
    latestBids,
    latestAsks,
    highlightedPrice,
    processedHistory,
  } = processedData;

  // Determines the color of a bar based on its type and state (hovered, pressure zone, etc.).
  const getBarColor = (type, price, isHovered) => {
    if (isHovered) return COLORS.highlight;
    if (highlightedPrice && price === highlightedPrice) return COLORS.highlight;
    if (pressureZones?.has(price)) {
      return type === "bid" ? COLORS.bidPressure : COLORS.askPressure;
    }
    return type === "bid" ? COLORS.bid : COLORS.ask;
  };

  // Render a fallback message if there's no data to display.
  if (!latestBids || !latestAsks) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-800 text-white">
        Loading order book data or insufficient data to display...
      </div>
    );
  }

  return (
    <Canvas
      shadows
      camera={{ position: [0, 25, 45], fov: 50 }}
      style={{ background: COLORS.background }}
    >
      {/* --- Lighting & Effects --- */}
      <ambientLight intensity={0.8} />
      <spotLight
        position={[40, 50, 30]}
        intensity={1.5}
        angle={0.3}
        penumbra={0.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-20, 30, -20]} intensity={0.5} />

      {/* --- Controls & Helpers --- */}
      <OrbitControls makeDefault />
      <Grid
        position={[0, -0.01, 0]}
        args={[100, 100]}
        sectionColor={COLORS.grid}
        cellColor={COLORS.grid}
        fadeDistance={100}
        infiniteGrid
      />

      <RotatingGroup autoRotate={autoRotate}>
        {/* --- LATEST SNAPSHOT (Front layer, interactive) --- */}
        {latestAsks.map((ask) => (
          <Bar
            key={`ask-${ask.price}`}
            position={[ask.price - centerPrice, ask.cumulativeQuantity / 2, 0]}
            size={[0.2, ask.cumulativeQuantity, 0.2]}
            color={getBarColor(
              "ask",
              ask.price,
              hoveredData?.price === ask.price
            )}
            onPointerOver={() => setHoveredData(ask)}
            onPointerOut={() => setHoveredData(null)}
          />
        ))}
        {latestBids.map((bid) => (
          <Bar
            key={`bid-${bid.price}`}
            position={[bid.price - centerPrice, bid.cumulativeQuantity / 2, 0]}
            size={[0.2, bid.cumulativeQuantity, 0.2]}
            color={getBarColor(
              "bid",
              bid.price,
              hoveredData?.price === bid.price
            )}
            onPointerOver={() => setHoveredData(bid)}
            onPointerOut={() => setHoveredData(null)}
          />
        ))}

        {/* --- HISTORICAL DATA (Rendered as non-interactive "ghosts") --- */}
        {processedHistory?.map((snapshot, historyIndex) => {
          // Fade out older snapshots for a cleaner look.
          const opacity = Math.max(0, 0.3 - historyIndex * 0.01);
          if (opacity === 0) return null;

          return (
            <group
              key={snapshot.timestamp}
              position={[0, 0, -(historyIndex + 1) * Z_SPACING]}
            >
              {snapshot.asks.map((ask) => (
                <mesh
                  key={`ask-hist-${ask.price}`}
                  position={[ask.price - centerPrice, ask.quantity / 2, 0]}
                >
                  <boxGeometry args={[0.1, ask.quantity, 0.1]} />
                  <meshBasicMaterial
                    color={COLORS.ask}
                    transparent
                    opacity={opacity}
                  />
                </mesh>
              ))}
              {snapshot.bids.map((bid) => (
                <mesh
                  key={`bid-hist-${bid.price}`}
                  position={[bid.price - centerPrice, bid.quantity / 2, 0]}
                >
                  <boxGeometry args={[0.1, bid.quantity, 0.1]} />
                  <meshBasicMaterial
                    color={COLORS.bid}
                    transparent
                    opacity={opacity}
                  />
                </mesh>
              ))}
            </group>
          );
        })}

        {/* --- UI Elements within the 3D Scene --- */}
        <PriceTicks
          bids={latestBids}
          asks={latestAsks}
          centerPrice={centerPrice}
        />
        <HoverInfo
          data={hoveredData}
          centerPrice={centerPrice}
          colors={COLORS}
        />
      </RotatingGroup>

      {/* --- Static Axes Labels (Attached to the main scene) --- */}
      {centerPrice > 0 && (
        <>
          <Text
            color={COLORS.textPrimary}
            position={[0, -2.5, 0]}
            fontSize={0.8}
            anchorX="center"
          >
            Price (Centered at {centerPrice.toFixed(2)})
          </Text>
          <Text
            color={COLORS.textPrimary}
            position={[-25, 1, 0]}
            rotation={[0, 0, Math.PI / 2]}
            fontSize={0.8}
            anchorX="center"
          >
            Cumulative Quantity
          </Text>
          <Text
            color={COLORS.textPrimary}
            position={[0, 1, -25]}
            rotation={[Math.PI / 2, 0, 0]}
            fontSize={0.8}
            anchorX="center"
          >
            Time
          </Text>
        </>
      )}
    </Canvas>
  );
};

export default Scene;
