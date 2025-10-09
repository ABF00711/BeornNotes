import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

const defaultInactiveTime = 1 * 60;
const alertingTime = 10;

function ActiveTimeCounter() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [inActiveTime, setInActiveTime] = useState(0);
    const [isInActive, setIsInActive] = useState(false);
    const lastActiveRef = useRef(Date.now());

    useEffect(() => {
        setInActiveTime(0);
        const updateActivity = () => {
            lastActiveRef.current = Date.now();
        };

        const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
        events.forEach(e => window.addEventListener(e, updateActivity));

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = now - lastActiveRef.current;
            setInActiveTime(parseInt(diff / 1000))
        }, 1000);


        return () => {
            clearInterval(interval);
            events.forEach(e => window.removeEventListener(e, updateActivity));
        };
    }, []);

    useEffect(() => {
        if (inActiveTime > alertingTime && isInActive) {
            onCancel();
            return;
        }
        if (inActiveTime > defaultInactiveTime) {
            setIsInActive(true);
            setInActiveTime(0);
            lastActiveRef.current = Date.now();
            setIsOpen(true);
        }
    }, [inActiveTime])

    const onOK = () => {
        setIsInActive(false);
        setIsOpen(false);
    }

    const onCancel = () => {
        navigate("/login");
        setIsInActive(false);
    }

    return (
        <Modal
            open={isOpen}
            onOk={onOK}
            onCancel={onCancel}
        >
            <h3>Do you want to stay logged in?</h3>
            <h5 style={{color: "red"}}>{alertingTime - inActiveTime}</h5>
        </Modal>
    );
}

export default ActiveTimeCounter; 