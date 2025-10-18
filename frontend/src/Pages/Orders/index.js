import React, { useContext } from "react";
import "./style.css";
import Header from "../../Components/Header";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { MyContext } from "../../Context";

function Orders() {
    const { isCollapsed } = useContext(MyContext);

    return (
        <div className="main">
            <h1>This is orders</h1>
        </div>
    );
}

export default Orders;