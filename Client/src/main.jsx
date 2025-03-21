import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/settings" element={<UpdatePassword />} />
      </Routes>
    </Router>
  </StrictMode>
);
