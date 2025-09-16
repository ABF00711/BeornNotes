import React, {useContext} from "react";
import "./style.css";
import { MyContext } from "../../../Context";
import Header from "../../../Components/Header";
import Navbar from "../../Navbar";
import Sidebar from "../../Sidebar";

function SummaryReport() {
    const {isCollapsed} = useContext(MyContext);

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <div className="main">
                    <h1>Here is summary reports</h1>
                </div>
            </div>
            <Sidebar />
        </div>
    );
}

export default SummaryReport;