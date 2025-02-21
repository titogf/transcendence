// import axios from "axios";
// const API_URL = import.meta.env.VITE_BACKEND_URL;

// const fetchData = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/`);
//     document.getElementById("message")!.textContent = response.data.message;
//   } catch (error) {
//     console.error("Error al conectar con el backend:", error);
//   }
// };

// fetchData();

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./pages/Home.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
