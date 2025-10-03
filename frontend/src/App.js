import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import ContextProvider from './Context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Pages/Dashboard';
import Customers from './Pages/Customers';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
import Orders from './Pages/Orders';
import InventoryReport from './Pages/Reports/InventoryReport';
import SummaryReport from './Pages/Reports/SummaryReport';
import Profile from './Pages/Profile';
import Products from './Pages/Products';
import Customers2 from './Pages/Customers2';
import Customers3 from './Pages/Customers3';
import AddCustomers from './Pages/Customers3/AddCustomers';
import { Smart } from 'smart-webcomponents-react/grid';
import Customers4 from './Pages/Customers4';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule ]);
LicenseManager.setLicenseKey("Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-103811}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Beornsoft,_LLC}_is_granted_a_{Multiple_Applications}_Developer_License_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Charts_and_AG_Grid}_Enterprise___This_key_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{20_October_2026}____[v3]_[0102]_MTc5MjQ1MDgwMDAwMA==4696f1d596c6d71813a6b8c15f1940e5");

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
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers2" element={<Customers2 />} />
            <Route path="/customers3" element={<Customers3 />} />
            <Route path="/customers4" element={<Customers4 />} />
            <Route path="/customers3/create" element={<AddCustomers />} />
            <Route path="/customers3/update" element={<AddCustomers />} />
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
