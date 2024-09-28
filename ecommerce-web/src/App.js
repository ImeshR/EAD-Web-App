import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import AdminDashboard from "./pages/AdminDashboard/page";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
