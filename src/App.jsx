import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Drivers from "./component/admin/drivers/Drivers";
import DriversDetailsPage from "./component/admin/drivers/DriverDetailpage";
import AdminLogin from "./component/admin/auth/Login";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Drivers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/drivers/:id"
          element={
            <ProtectedRoute>
              <DriversDetailsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;