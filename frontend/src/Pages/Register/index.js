import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import useSearchConfig from "../../Hooks/useSearchConfig";
import { MyContext } from "../../Context";
import InputGroup from "../../Components/InputGroup";
import TextField from "../../Components/TextField";
import EmailField from "../../Components/EmailField";
import PasswordField from "../../Components/PasswordField";
import useMenuItems from "../../Hooks/useMenuItems";

function Register() {
    const navigate = useNavigate();
    const { searchConfig } = useContext(MyContext);
    const { getSearchConfigData } = useSearchConfig();
    const {getMenuItems} = useMenuItems();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const { register } = useAuth();
    const [registerData, setRegisterData] = useState([]);
    const [submitted, setSubmitted] = useState(false);

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

    const validateFields = () => {
        let result = true;
        if(formData.password == "") result = false;
        if(formData.name == "" || formData.email == "") result = false;
        registerData.forEach((item) => {
            if(item.mandatory && (formData[item.field_name].trim(" ") == "")) result = false;
        })
        return result;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();     
        setSubmitted(true); 
        if (formData.password !== formData.confirmPassword) {
            toast.error("Password and Confirm Password do not match!", { position: "top-right" });
            return;
        }
        if(!validateFields()) return;

        if (await register(formData)) {
            getMenuItems();
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
                    <TextField
                        name="name"
                        label="Username"
                        value={formData.name}
                        onChange={handleChange}
                        required={true}
                        submitted={submitted}
                    />
                    <EmailField
                        name="email"
                        label="Email"
                        value={formData.email}
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
                    <PasswordField
                        name="confirmPassword"
                        label="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required={true}
                        submitted={submitted}
                    />
                    {registerData.map((item) => {
                        return (
                        <InputGroup props={{ fieldFormat: item, value: formData[item.field_name], handleChange, submitted }} />
                    )
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