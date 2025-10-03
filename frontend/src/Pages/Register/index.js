import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import useAuth from "../../Hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "./userSchema";
import TextField from "../../Components/TextField";
import EmailField from "../../Components/EmailField";
import PasswordField from "../../Components/PasswordField";

function Register() {
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();

    const { register, control, handleSubmit, formState: { errors, isSubmitting, isSubmitted } } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" }
    });

    const onSubmit = async (data) => {
        const ok = await registerUser(data);
        if (ok) navigate("/");
    };

    return (
        <div className="auth-container">
            <div className="auth-card register-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join BeornNotes and start managing your customers</p>
                </div>
                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className={`field-container ${errors.name ? 'has-error' : ''} ${isSubmitted && !errors.name ? 'has-success' : ''}`}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    name="name"
                                    label="Username"
                                    value={field.value}
                                    onChange={field.onChange}
                                    required={true}
                                    submitted={isSubmitted}
                                />
                            )}
                        />
                        {errors.name && <p>{errors.name.message}</p>}
                    </div>

                    <div className={`field-container ${errors.email ? 'has-error' : ''} ${isSubmitted && !errors.email ? 'has-success' : ''}`}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <EmailField
                                    name="email"
                                    label="Email"
                                    value={field.value}
                                    onChange={field.onChange}
                                    required={true}
                                    submitted={isSubmitted}
                                />
                            )}
                        />
                        {errors.email && <p>{errors.email.message}</p>}
                    </div>

                    <div className={`field-container ${errors.password ? 'has-error' : ''} ${isSubmitted && !errors.password ? 'has-success' : ''}`}>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <PasswordField
                                    name="password"
                                    label="Password"
                                    value={field.value}
                                    onChange={field.onChange}
                                    required={true}
                                    submitted={isSubmitted}
                                />
                            )}
                        />
                        {errors.password && <p>{errors.password.message}</p>}
                    </div>

                    <div className={`field-container ${errors.confirmPassword ? 'has-error' : ''} ${isSubmitted && !errors.confirmPassword ? 'has-success' : ''}`}>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <PasswordField
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    value={field.value}
                                    onChange={field.onChange}
                                    required={true}
                                    submitted={isSubmitted}
                                />
                            )}
                        />
                        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
                    </div>
                    <div className="terms-section">
                        <label className="terms-checkbox">
                            <input type="checkbox" required />
                            <span>I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a></span>
                        </label>
                    </div>
                    <button type="submit" className="auth-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Account'}
                    </button>
                </form>
                <div className="auth-footer">
                    <p>Already have an account? <a href="/login" className="auth-link">Sign in</a></p>
                </div>
            </div>
        </div>
    );
}

export default Register;