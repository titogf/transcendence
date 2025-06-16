import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pong from "./game/Pong";
import Login from "./login/Login";
import Profile from "./profile/Profile";
import Register from "./register/Register";
import Tournament from "./tournament/Tournament";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={<Pong />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tournament" element={<Tournament />} />
      </Routes>
    </Router>
  );
}

export default App;
