import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext";
import PrivateRoute from "./services/PrivateRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import Habits from "./pages/Habits";



function App() {
  return (
    <AuthProvider>
        <BrowserRouter  basename="/habit-front">
          <Routes>      
            {/* routes public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* routes privates */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="stats" element={<Stats />} />
                <Route path="settings" element={<Settings />} />
                <Route path="habits" element={<Habits />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
