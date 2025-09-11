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
// import 'ag-grid-community/styles/ag-grid.css';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function App() {

  return (
    <ContextProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/customers" element={<Customers />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </div>
    </ContextProvider>
  );
}

export default App;
