import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard/page";
import CSRDashboard from "./pages/CSRDashboard/page";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/csr-dashboard" element={<CSRDashboard/>} />
      </Routes>
    </div>
  );
}

export default App;
