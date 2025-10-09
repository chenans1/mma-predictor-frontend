// App.jsx
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/homePage";
import EventPage from "./pages/eventPage";

export default function App() {
  return (
    <BrowserRouter>
      {/* Header positioned top-left and bold */}
      <header
        style={{
          position: "absolute",
          top: "16px",
          left: "24px",
          fontWeight: "bold",
          fontSize: "20px",
          color: "#e6e6e6",
        }}
      >
        UFC ML Powered Fight Predictor
      </header>

      {/* Main content container */}
      <main
        style={{
          padding: "80px 24px 24px", // add top padding so content doesn't overlap the header
          maxWidth: "1000px",
          margin: "0 auto",
          color: "#e6e6e6",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:event_id" element={<EventPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
