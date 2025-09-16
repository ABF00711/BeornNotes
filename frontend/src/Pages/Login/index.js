import React, { useState } from "react";
import "./style.css";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PasswordField from "../../Components/PasswordField";
import TextField from "../../Components/TextField";
import useMenuItems from "../../Hooks/useMenuItems";
import useTabbedInterfaces from "../../Hooks/useTabbedInterfaces";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const { login } = useAuth();
    const {goToActiveUrl} = useTabbedInterfaces();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (await login(formData)) {
            const tabbedInterface = localStorage.getItem("tabbedInterface");
            goToActiveUrl(navigate);
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
                    <TextField
                        name="email"
                        label="Username or Email"
                        value={formData.name}
                        onChange={handleChange}
                        required={true}
                        submitted={submitted}
                    />

                    <PasswordField
                        name="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required={true}
                        submitted={submitted}
                    />

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