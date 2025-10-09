// src/App.jsx
// import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/homePage";
import EventPage from "./pages/eventPage";
import styles from "./App.module.css";

export default function App() {
  return (
    <BrowserRouter>
      <header className={styles.header}>
        UFC Machine-Learning Powered Fight Predictor
      </header>

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:event_id" element={<EventPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
