import React, { useState } from "react";
import "./style.css";

function Register(){
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Registration data:", formData);
    };

    return (
        <div className="auth-container">
            <div className="auth-card register-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join BeornNotes and start managing your customers</p>
                </div>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input 
                            type="text" 
                            name="name"
                            placeholder="Full Name" 
                            className="auth-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email Address" 
                            className="auth-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Password" 
                            className="auth-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <input 
                            type="password" 
                            name="confirmPassword"
                            placeholder="Confirm Password" 
                            className="auth-input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="terms-section">
                        <label className="terms-checkbox">
                            <input type="checkbox" required />
                            <span>I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a></span>
                        </label>
                    </div>
                    
                    <button type="submit" className="auth-button">
                        Create Account
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>Already have an account? <a href="/" className="auth-link">Sign in</a></p>
                </div>
            </div>
        </div>
    );
}

export default Register;