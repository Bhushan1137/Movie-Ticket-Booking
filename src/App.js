import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./components/Home";
import MovieDetails from "./components/MovieDetails";
import SearchResults from "./components/SearchResults";
import SeatSelection from "./components/SeatSelection"; // ✅ Import Seat Selection
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/seat-selection/:id" element={<SeatSelection />} /> {/* ✅ Add missing route */}
      </Routes>
    </Router>
  );
}

export default App;
