import React, { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { Modal, Switch, Input, Button, message } from "antd";
import { toast } from "react-toastify";

function GAuthenticator() {
    const { userData, getQRCode, disableMFA, enableMFA } = useAuth();
    const [isMFA, setIsMFA] = useState(userData?.mfa || false);
    const [QRcode, setQRCode] = useState({
        url: "",
        secret: ""
    });
    const [verificationCode, setVerificationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showVerification, setShowVerification] = useState(false);

    // Sync with userData changes
    useEffect(() => {
        setIsMFA(userData?.mfa || false);
    }, [userData?.mfa]);

    const onMFA = async (checked) => {
        if (!checked) {
            if (window.confirm("Really want to disable Google Authenticator?")) {
                setIsLoading(true);
                try {
                    await disableMFA();
                    setIsMFA(false);
                    toast.success("Google Authenticator disabled successfully");
                } catch (error) {
                    toast.error("Failed to disable Google Authenticator");
                } finally {
                    setIsLoading(false);
                }
            }
            return;
        }
        
        setIsLoading(true);
        try {
            const _QRcode = await getQRCode();
            if (_QRcode && _QRcode.url) {
                setQRCode(_QRcode);
                setShowVerification(true);
            } else {
                toast.error("Failed to generate QR code");
            }
        } catch (error) {
            toast.error("Failed to generate QR code");
        } finally {
            setIsLoading(false);
        }
    }

    const handleVerification = async () => {
        if (!verificationCode.trim()) {
            toast.error("Please enter the verification code");
            return;
        }

        setIsLoading(true);
        try {
            await enableMFA(verificationCode);
            setIsMFA(true);
            setQRCode({ url: "", secret: "" });
            setVerificationCode("");
            setShowVerification(false);
            toast.success("Google Authenticator enabled successfully");
        } catch (error) {
            toast.error("Invalid verification code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const onCancel = () => {
        setQRCode({ url: "", secret: "" });
        setVerificationCode("");
        setShowVerification(false);
    }

    return (
        <>
            <h2>Google Authenticator</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Switch 
                    checked={isMFA} 
                    onChange={onMFA} 
                    loading={isLoading}
                    disabled={isLoading}
                />
                <span>Check to {isMFA ? 'Disable' : 'Enable'} Authenticator</span>
            </div>
            
            <Modal
                title="Setup Google Authenticator"
                open={showVerification}
                onCancel={onCancel}
                footer={[
                    <Button key="cancel" onClick={onCancel}>
                        Cancel
                    </Button>,
                    <Button 
                        key="verify" 
                        type="primary" 
                        onClick={handleVerification}
                        loading={isLoading}
                        disabled={!verificationCode.trim()}
                    >
                        Verify & Enable
                    </Button>
                ]}
                width={400}
            >
                <div style={{ textAlign: 'center' }}>
                    <h3>Scan QR Code</h3>
                    {QRcode.url && (
                        <div style={{ marginBottom: '20px' }}>
                            <img 
                                src={QRcode.url} 
                                alt="QR Code" 
                                style={{ maxWidth: '200px', height: 'auto' }}
                            />
                        </div>
                    )}
                    
                    <p style={{ marginBottom: '10px' }}>
                        Scan this QR code with your Google Authenticator app, then enter the 6-digit code below:
                    </p>
                    
                    {QRcode.secret && (
                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                            Manual entry key: <code>{QRcode.secret}</code>
                        </p>
                    )}
                    
                    <Input
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '2px' }}
                    />
                </div>
            </Modal>
        </>
    );
}

export default GAuthenticator;