import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import "./style.css";
import InputGroup from "../InputGroup";
import useDynamicData from "../../Hooks/useDynamicData";

function DynamicModal({ table_name, isOpen, setIsOpen, title, role, fieldsData, initData = {} }) {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({});
    const { createDynamicData, updateDynamicData } = useDynamicData();

    const validateFields = () => {
        let result = true;
        if (formData.password === "") result = false;
        if (formData.name === "" || formData.email === "") result = false;
        fieldsData.forEach((item) => {
            if (item.mandatory && (formData[item.field_name].trim(" ") === "")) result = false;
            if (!formData[item.field_name]) formData[item.field_name] = null;
        })
        return result;
    }

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            setSubmitted(true);
            if (!validateFields()) return;

            if (role === "create") createDynamicData(table_name, formData);
            if (role === "update") updateDynamicData(table_name, formData);

            onInit();
            setIsOpen(false);
        } catch (error) {
            console.log("hanleSubmitError: ", error);
        }
    }

    const onInit = () => {
        let _formData = {};
        for (const key in formData) {
            _formData[key] = "";
        }
        setFormData(_formData);
        setSubmitted(false);
    }

    const onCancel = () => {
        onInit();
        setIsOpen(false);
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        setFormData(initData);
    }, [isOpen, initData])

    return (
        <>
            <Modal open={isOpen} onCancel={onCancel} onOk={handleSubmit}>
                <h1>{title}</h1>
                {
                    fieldsData.map((item) => {
                        return <InputGroup props={{ fieldFormat: item, value: formData[item.field_name], handleChange, submitted }} />
                    })
                }
            </Modal>
        </>
    );
}

export default DynamicModal;