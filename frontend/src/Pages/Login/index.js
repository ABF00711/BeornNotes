import React, { useState } from "react";
import "./style.css";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PasswordField from "../../Components/PasswordField";
import TextField from "../../Components/TextField"
import useTabbedInterfaces from "../../Hooks/useTabbedInterfaces";
import { toast } from "react-toastify";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        mfaCode: ""
    })
    const [mfaRequired, setMfaRequired] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const {currentInterface} = useTabbedInterfaces();
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setIsLoading(true);

        try {
            const result = await login(formData);
            
            if (result === "mfa_required") {
                setMfaRequired(true);
                toast.info("Please enter your 6-digit authentication code");
            } else if (result === true) {
                navigate(currentInterface.activeUrl);
            }
        } catch (error) {
            console.log("Login error:", error);
        } finally {
            setIsLoading(false);
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
                        value={formData.email}
                        onChange={handleChange}
                        required={true}
                        submitted={submitted}
                        disabled={mfaRequired}
                    />

                    <PasswordField
                        name="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required={true}
                        submitted={submitted}
                        disabled={mfaRequired}
                    />

                    {mfaRequired && (
                        <div className="mfa-section">
                            <TextField
                                name="mfaCode"
                                label="Authentication Code"
                                value={formData.mfaCode}
                                onChange={handleChange}
                                required={true}
                                submitted={submitted}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                style={{ 
                                    textAlign: 'center', 
                                    fontSize: '18px', 
                                    letterSpacing: '2px',
                                    fontFamily: 'monospace'
                                }}
                            />
                            <p className="mfa-help">
                                Enter the 6-digit code from your authenticator app
                            </p>
                        </div>
                    )}

                    {!mfaRequired && (
                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing In..." : mfaRequired ? "Verify & Sign In" : "Sign In"}
                    </button>

                    {mfaRequired && (
                        <button 
                            type="button" 
                            className="auth-button secondary"
                            onClick={() => {
                                setMfaRequired(false);
                                setFormData(prev => ({ ...prev, mfaCode: "" }));
                            }}
                        >
                            Back to Login
                        </button>
                    )}
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <a href="/register" className="auth-link">Sign up</a></p>
                </div>
            </div>
        </div>
    );
}

export default Login;