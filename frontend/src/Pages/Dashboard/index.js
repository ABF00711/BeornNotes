import React, {useEffect} from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import Header from "../../Components/Header";

function Dashboard(){
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();

    const isAuth = async () => {
        const res = await isAuthenticated();
        if(!res){
            navigate("/login");
            return;
        }
    }

    useEffect(() => {
      isAuth()
    }, [])

    return (
        <div className="dashboard">
            <div className="dashboard-container">
                <Header />
            </div>
        </div>
    );
}

export default Dashboard;