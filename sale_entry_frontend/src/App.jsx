import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import Products from './pages/Products/Products';
import Salespersons from './pages/Salespersons/Salespersons';
import Orders from './pages/Orders/Orders';

import SalespersonLayout from './layouts/SalespersonLayout/SalespersonLayout';
import SalespersonDashboard from './pages/SalespersonDashboard/SalespersonDashboard';
import SalespersonCustomers from './pages/SalespersonCustomers/SalespersonCustomers';
import SalespersonNewOrder from './pages/SalespersonNewOrder/SalespersonNewOrder';
import SalespersonOrders from './pages/SalespersonOrders/SalespersonOrders';
import SalespersonProfile from './pages/SalespersonProfile/SalespersonProfile';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Nested Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="salespersons" element={<Salespersons />} />
        <Route path="orders" element={<Orders />} />
      </Route>

      {/* Nested Salesperson Routes */}
      <Route path="/salesperson" element={<SalespersonLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SalespersonDashboard />} />
        <Route path="customers" element={<SalespersonCustomers />} />
        <Route path="new-order" element={<SalespersonNewOrder />} />
        <Route path="orders" element={<SalespersonOrders />} />
        <Route path="profile" element={<SalespersonProfile />} />
      </Route>

      {/* Redirect root to login for now */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
