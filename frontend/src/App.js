import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import ContextProvider from './Context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Pages/Dashboard';
import Orders from './Pages/Orders';
import InventoryReport from './Pages/Reports/InventoryReport';
import SummaryReport from './Pages/Reports/SummaryReport';
import Profile from './Pages/Profile';
import Products from './Pages/Products';
import Customers2 from './Pages/Customers2';
import Customers from './Pages/Customers';
import Layout from './Pages/Layout';

// Register all Community features
if (window.Smart) {
  window.Smart.License = "0A2C72B9-D78F-5E17-8D07-0CBC0E1EDC29";
} else {
  window.Smart = {
    License: "0A2C72B9-D78F-5E17-8D07-0CBC0E1EDC29"
  };
}

function App() {

  return (
    <ContextProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers2" element={<Customers2 />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/summary_report" element={<SummaryReport />} />
              <Route path="/inventory_report" element={<InventoryReport />} />
            </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </div>
    </ContextProvider>
  );
}

export default App;
