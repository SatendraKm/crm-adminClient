import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProtectedRoute from './utils/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import Employees from './pages/admin/Employees/Employees';
import Campaigns from './pages/admin/Campaign/Campaigns';
import Regions from './pages/admin/Regions/Regions';
// import Temp from './pages/admin/Temp/Regions/Regions';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="regions" element={<Regions />} />
        {/* <Route path="temp" element={<Temp />} /> */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
