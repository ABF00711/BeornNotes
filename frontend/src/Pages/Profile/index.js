import React, { useState } from "react";
import "./style.css";
import useAuth from "../../Hooks/useAuth";
import { MyContext } from "../../Context";
import TextField from "../../Components/TextField";
import EmailField from "../../Components/EmailField";
import PasswordField from "../../Components/PasswordField";
import GAuthenticator from "./GAthenticator";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "./profileSchema";
import { useForm, Controller } from "react-hook-form";
import { passwordSchema } from "./passwordSchema";

function Profile() {
    const { updateProfile, changePassword, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const { control: profileControl, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors, isSubmitting: isSubmittingProfile, isSubmitted: isSubmittedProfile } } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: userData.name, email: userData.email }
    });

    const { control: passwordControl, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword, isSubmitted: isSubmittedPassword } } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" }
    });

    const handleUpdateProfile = async (data) => {
        try {
            setIsLoading(true);
            await updateProfile(data);
        } catch (error) {
            console.log("handleError: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (data) => {
        try {
            setIsLoading(true);
            await changePassword(data);
        } catch (error) {
            console.log("handleError: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="main">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Profile Settings</h1>
                    <p>Manage your account information and preferences</p>
                </div>

                <div className="profile-content">
                    <div className="profile-section">
                        <h2>Basic Information</h2>
                        <form className="profile-form" onSubmit={handleSubmitProfile(handleUpdateProfile)}>
                            <div className={` ${profileErrors.name ? 'has-error' : ''} ${isSubmittedProfile && !profileErrors.name ? 'has-success' : ''}`}>
                                <Controller
                                    name="name"
                                    control={profileControl}
                                    render={({ field }) => (
                                        <TextField
                                            name="name"
                                            label="Username"
                                            value={field.value}
                                            onChange={field.onChange}
                                            required={true}
                                            submitted={isSubmittedProfile}
                                        />
                                    )}
                                />
                                {profileErrors.name && <p>{profileErrors.name.message}</p>}
                            </div>
                            <div className={` ${profileErrors.email ? 'has-error' : ''} ${isSubmittedProfile && !profileErrors.email ? 'has-success' : ''}`}>
                                <Controller
                                    name="email"
                                    control={profileControl}
                                    render={({ field }) => (
                                        <EmailField
                                            name="email"
                                            label="Email"
                                            value={field.value}
                                            onChange={field.onChange}
                                            required={true}
                                            submitted={isSubmittedProfile}
                                        />
                                    )}
                                />
                                {profileErrors.email && <p>{profileErrors.email.message}</p>}
                            </div>

                            <button type="submit" className="profile-button" disabled={isSubmittingProfile || isLoading}>
                                {isSubmittingProfile || isLoading ? "Updating..." : "Update Profile"}
                            </button>
                        </form>
                        <h2>Change Password</h2>
                        <form className="profile-form" onSubmit={handleSubmitPassword(handlePasswordChange)}>
                            <div className={` ${passwordErrors.currentPassword ? 'has-error' : ''} ${isSubmittedPassword && !passwordErrors.currentPassword ? 'has-success' : ''}`}>
                                <Controller
                                    name="currentPassword"
                                    control={passwordControl}
                                    render={({ field }) => (
                                        <PasswordField
                                            name="currentPassword"
                                            label="Current Password"
                                            value={field.value}
                                            onChange={field.onChange}
                                            required={true}
                                            submitted={isSubmittedPassword}
                                        />
                                    )}
                                />
                                {passwordErrors.currentPassword && <p>{passwordErrors.currentPassword.message}</p>}
                            </div>
                            <div className={` ${passwordErrors.newPassword ? 'has-error' : ''} ${isSubmittedPassword && !passwordErrors.newPassword ? 'has-success' : ''}`}>
                                <Controller
                                    name="newPassword"
                                    control={passwordControl}
                                    render={({ field }) => (
                                        <PasswordField
                                            name="newPassword"
                                            label="New Password"
                                            value={field.value}
                                            onChange={field.onChange}
                                            required={true}
                                            submitted={isSubmittedPassword}
                                        />
                                    )}
                                />
                                {passwordErrors.newPassword && <p>{passwordErrors.newPassword.message}</p>}
                            </div>
                            <div className={` ${passwordErrors.confirmPassword ? 'has-error' : ''} ${isSubmittedPassword && !passwordErrors.confirmPassword ? 'has-success' : ''}`}>
                                <Controller
                                    name="confirmPassword"
                                    control={passwordControl}
                                    render={({ field }) => (
                                        <PasswordField
                                            name="confirmPassword"
                                            label="Confirm New Password"
                                            value={field.value}
                                            onChange={field.onChange}
                                            required={true}
                                            submitted={isSubmittedPassword}
                                        />
                                    )}
                                />
                                {passwordErrors.confirmPassword && <p>{passwordErrors.confirmPassword.message}</p>}
                            </div>
                            <button type="submit" className="profile-button secondary" disabled={isSubmittingPassword || isLoading}>
                                {isSubmittingPassword || isLoading ? "Changing..." : "Change Password"}
                            </button>
                        </form>
                        <GAuthenticator />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;