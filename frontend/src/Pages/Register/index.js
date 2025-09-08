import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import useSearchConfig from "../../Hooks/useSearchConfig";
import { MyContext } from "../../Context";
import InputGroup from "../../Components/InputGroup";

function Register() {
    const navigate = useNavigate();
    const { searchConfig } = useContext(MyContext);
    const { getSearchConfigData } = useSearchConfig();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const { register } = useAuth();
    const [registerData, setRegisterData] = useState([]);

    const getRigisterData = () => {
        const _registerData = searchConfig.filter((item) => { return item.table_name == "registeration" });
        _registerData.map((item) => {
            setFormData((prevFormData) => ({ ...prevFormData, [item.field_name]: "" }));
        })

        setRegisterData(_registerData);
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Password and Confirm Password do not match!", { position: "top-right" });
            return;
        }
        if (await register(formData)) {
            navigate("/")
        }
    };

    useEffect(() => {
        getRigisterData();
    }, [searchConfig])

    useEffect(() => {
        getSearchConfigData()
    }, [])

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
                            type="text"
                            name="email"
                            placeholder="Email"
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
                            placeholder="ConfirmPassword"
                            className="auth-input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {registerData.map((item) => {
                        return <InputGroup props={{ fieldFormat: item, value: formData[item.field_name], handleChange }} />
                    })}

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