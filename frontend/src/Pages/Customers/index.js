import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import "./style.css";
import Header from "../../Components/Header";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { MyContext } from "../../Context";
import SmartGrid from "../../Components/SmartGrid";
import Add from "../../Components/Add";
import SmartDelete from "../../Components/Delete";
import SmartLayouts from "../../Components/Layouts";
import SmartSearchPattern from "../../Components/SearchPattern";
import Update from "../../Components/Update";
import ResetBtn from "../../Components/Reset";


function Customers() {
    const { isCollapsed } = useContext(MyContext);
    const gridRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [updateData, setUpdateData] = useState({});

    const openUpdateModal = useCallback((data) => {
        setUpdateData(data);
        setIsOpen(true);
    }, [])

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}> 
                <div className="customers4">
                    <div className="customers4-toolbar">
                        <div className="toolbar-left">
                            <Add table_name="customers" />
                            <SmartDelete tablename="customers" gridRef={gridRef} />
                            <ResetBtn gridRef = {gridRef} />
                        </div>
                        <div className="toolbar-right">
                            <SmartLayouts tablename="customers4" gridRef={gridRef} />
                            <SmartSearchPattern tablename="customers4" gridRef={gridRef} />
                        </div>
                    </div>
                    <SmartGrid
                        tablename="customers"
                        gridRef={gridRef}
                        openUpdateModal = {openUpdateModal}
                        />
                    <Update
                        tablename={"customers"}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        updateData={updateData}
                        setUpdateData={setUpdateData}
                    />
                </div>
            </div>
            <Sidebar />
        </div>
    );
}

export default Customers;