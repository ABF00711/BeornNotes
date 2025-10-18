import { useContext } from "react";
import { MyContext } from "../../Context";
import { Outlet } from "react-router-dom";
import Header from "../../Components/Header";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

function Layout() {
    const {isCollapsed} = useContext(MyContext);

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <Outlet />                    
            </div>
            <Sidebar />
        </div>
    );
}

export default Layout;