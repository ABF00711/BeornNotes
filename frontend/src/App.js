import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import ContextProvider from './Context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Pages/Dashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ContextProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <ToastContainer />
        </ContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
