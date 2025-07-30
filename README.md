## Orderbook Depth 3D Visualizer

This project is a Next.js application that provides a real-time, interactive 3D visualization of cryptocurrency order book data. It is designed to offer a deeper understanding of market dynamics by representing price, quantity, and time in a 3D environment, complete with features like pressure zone analysis and interactive controls.

## Video Demonstration
[Link to Video Demonstration Here]

## Features
**Interactive 3D Graph**: A 3D scene representing the order book with Price (X-axis), Cumulative Quantity (Y-axis), and Time (Z-axis).

**Manual Controls**: Users can freely rotate, pan, and zoom the camera to inspect the order book from any angle.

**Auto-Rotation:** A smooth, continuous rotation around the Y-axis to showcase the temporal dimension of the data.

**Real-time Data**: Live order book data is streamed directly from the Binance WebSocket API for up-to-the-second accuracy.

**Bid & Ask Visualization:** Bids (buy orders) and asks (sell orders) are clearly distinguished using green and red colors, respectively.

**Cumulative Depth:** The height of each bar represents the cumulative quantity at that price level, visualizing market depth.

**Pressure Zone Analysis:** Automatically identifies and highlights the top 5 price levels with the highest order concentrations, indicating potential support or resistance.

**Dynamic Filtering:**

**Quantity Threshold:** Filter out smaller orders to focus on significant market participants.

**Price Highlighting:** Search for and highlight a specific price level on the graph.

**Time Aggregation:** Switch between real-time data and aggregated views over different time intervals (1m, 5m, 15m, 1hr).

**Theme Toggle:** Seamlessly switch between a dark and light theme for optimal viewing comfort.

**Responsive Control Panel:** A clean, intuitive UI to manage all settings and view key information.

## Technical Stack & Decisions
**Framework**: Next.js was used as required by the assignment, providing a robust foundation with server-side rendering and a great developer experience.

**Language**: JavaScript. While the assignment suggested TypeScript, JavaScript was chosen for faster prototyping and iteration within the given timeframe.

**3D Rendering**: Three.js with @react-three/fiber and @react-three/drei. This stack was selected for its powerful and declarative approach to building complex 3D scenes within a React environment, allowing for seamless integration with the application's state.

**Real-time Data:** Binance WebSocket API. This was chosen as it is a free, reliable, and widely-used source for high-frequency order book data, which is essential for a real-time visualizer.

**State Management:** React Hooks (useState, useEffect) & Context API (useTheme). For an application of this scale, this native React solution is lightweight, efficient, and avoids the need for external state management libraries.

**Styling:** Tailwind CSS. A utility-first CSS framework that enabled rapid development of a clean, responsive, and modern user interface.

## Assumptions & Design Choices
**Data Source:** The application is built to use the Binance WebSocket API. While the assignment mentioned multi-venue filtering, the scope was focused on creating a robust and feature-rich visualization from a single, high-quality data source to ensure a polished final product.

**Pressure Zone Algorithm:** The pressure zone detection algorithm is implemented by identifying the top 5 price levels with the highest trade quantity in the most recent data snapshot. This provides a simple yet effective way to highlight areas of significant market interest.

**Time (Z-axis) Representation:** The temporal dimension is visualized by rendering "ghost" bars of previous order book snapshots along the Z-axis. This creates a historical trail, allowing users to see how the order book has evolved over the last few moments. Older snapshots are rendered with decreasing opacity for clarity.

**Performance**: To ensure a smooth 60fps experience, historical "ghost" bars are rendered as meshBasicMaterial which is less computationally expensive than the meshStandardMaterial used for the interactive front-layer bars. Data processing is also memoized using useMemo to prevent unnecessary re-calculations on each render.

## Local Setup Instructions
Follow these steps to run the project on your local machine.

**Prerequisites**

Node.js (v18.x or later recommended)
```bash
npm or yarn
```
## Installation & Setup
Clone the repository:
```bash
git clone <your-repository-url>
```

Navigate to the project directory:

```bash
cd orderbook-visualizer
```

**Install dependencies:**
```bash
npm install
```

(or yarn install if you use Yarn)

**Run the development server:**
```bash
npm run dev
```

(or yarn dev)

**Open the application:**
Open your web browser and navigate to http://localhost:3000. The application should now be running.
