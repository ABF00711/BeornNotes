import React, {useState} from "react";
import "./style.css";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const {login} = useAuth();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (await login(formData)){
            navigate("/dashboard");
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to your BeornNotes account</p>
                </div>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input 
                            type="email" 
                            placeholder="Email address" 
                            className="auth-input"
                            required
                            name = "email"
                            onChange = {handleChange}
                        />
                    </div>
                    
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="auth-input"
                            required
                            name = "password"
                            onChange = {handleChange}
                        />
                    </div>
                    
                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>
                    
                    <button type="submit" className="auth-button">
                        Sign In
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>Don't have an account? <a href="/register" className="auth-link">Sign up</a></p>
                </div>
            </div>
        </div>
    );
}

export default Login;