import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard/page";
import CSRDashboard from "./pages/CSRDashboard/page";
import Login from "./pages/Login/page";
import MyProfile from "./pages/MyProfile/page";
import Notifications from "./pages/Notifications/page";
import Reports from "./pages/Reports/page";
import VendorDashboard from "./pages/VendorDashboard/page";
import { UserProvider } from "./services/hooks/UserContext";


function App() {
  return (
    <UserProvider>
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<MyProfile/>} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/report" element={<Reports />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/csr-dashboard" element={<CSRDashboard/>} />
        <Route path="/vendor-dashboard" element={<VendorDashboard/>} />
      </Routes>
    </div>
    </UserProvider>
  );
}

export default App;
