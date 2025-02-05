import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_URL;

const fetchData = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    document.getElementById("message")!.textContent = response.data.message;
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
  }
};

fetchData();

