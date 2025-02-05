import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">{message || "Cargando..."}</h1>
    </div>
  );
}

export default App;
