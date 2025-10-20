import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import UpcomingFightsPage from "./pages/UpcomingFightsPage";
import PastFightsPage from "./pages/PastFightsPage";
import ModelPage from "./pages/ModelPage";
import AboutPage from "./pages/AboutPage";

import './App.css';

function App() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<UpcomingFightsPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
