import React, { useState } from "react";
import "./style.css";
import useAuth from "../../Hooks/useAuth";
import PasswordField from "../../Components/PasswordField";
import TextField from "../../Components/TextField"
import useTabbedInterfaces from "../../Hooks/useTabbedInterfaces";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./userLoginSchema";

function Login() {
    const { login } = useAuth();
    const { getCurrentTabInterface } = useTabbedInterfaces();

    const [mfaRequired, setMfaRequired] = useState(false);

    const { control, register, handleSubmit, setValue, setFocus, formState: { errors, isSubmitting, isSubmitted }, watch } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "", mfaCode: "", rememberMe: false, mfaRequired: false }
    });

    const onSubmit = async (data) => {
        const result = await login(data);
        if (result === "mfa_required") {
            setMfaRequired(true);
            setValue("mfaRequired", true, { shouldValidate: true });
            toast.info("Please enter your 6-digit authentication code");
            setTimeout(() => setFocus("mfaCode"), 0);
        } else if (result === true) {
            await getCurrentTabInterface();
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to your BeornNotes account</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className={`authField_container ${errors.email ? 'has-error' : ''} ${isSubmitted && !errors.email ? 'has-success' : ''}`}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    name="email"
                                    label="Username or Email"
                                    value={field.value}
                                    onChange={field.onChange}
                                    required={true}
                                    submitted={isSubmitted}
                                />
                            )}
                        />
                        {errors.email && <p>{errors.email.message}</p>}
                    </div>

                    <div className={`authField_container ${errors.password ? 'has-error' : ''} ${isSubmitted && !errors.password ? 'has-success' : ''}`}>
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

                    {mfaRequired && (
                        <div className="mfa-section">
                            <div className={`authField_container ${errors.mfaCode ? 'has-error' : ''} ${isSubmitted && !errors.mfaCode ? 'has-success' : ''}`}>
                                <Controller
                                    name="mfaCode"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            name="mfaCode"
                                            label="Authentication Code"
                                            value={field.value}
                                            onChange={(e) => {
                                                const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                field.onChange(onlyDigits);
                                            }}
                                            required={true}
                                            submitted={isSubmitted}
                                        />
                                    )}
                                />
                                {errors.mfaCode && <p>{errors.mfaCode.message}</p>}
                            </div>
                            <p className="mfa-help">
                                Enter the 6-digit code from your authenticator app
                            </p>
                        </div>
                    )}

                    {!mfaRequired && (
                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" {...register("rememberMe")} />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing In..." : mfaRequired ? "Verify & Sign In" : "Sign In"}
                    </button>

                    {mfaRequired && (
                        <button 
                            type="button" 
                            className="auth-button secondary"
                            onClick={() => {
                                setMfaRequired(false);
                                setValue("mfaRequired", false, { shouldValidate: true });
                                setValue("mfaCode", "", { shouldValidate: true });
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