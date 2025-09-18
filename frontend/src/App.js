import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import ContextProvider from './Context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Pages/Dashboard';
import Customers from './Pages/Customers';
import { AllCommunityModule, ModuleRegistry, SideBarModule } from 'ag-grid-community'; 
import Orders from './Pages/Orders';
import InventoryReport from './Pages/Reports/InventoryReport';
import SummaryReport from './Pages/Reports/SummaryReport';
import Customers2 from './Pages/Customers2';
import Profile from './Pages/Profile';
import Products from './Pages/Products';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule ]);

function App() {

  return (
    <ContextProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers2" element={<Customers2 />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/summary_report" element={<SummaryReport />} />
            <Route path="/inventory_report" element={<InventoryReport />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </div>
    </ContextProvider>
  );
}

export default App;
