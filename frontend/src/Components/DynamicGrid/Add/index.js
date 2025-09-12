import React, { useEffect, useState } from "react";
import "./style.css";
import { Modal } from "antd";
import useSearchConfig from "../../../Hooks/useSearchConfig";
import InputGroup from "../../InputGroup";
import useDynamicData from "../../../Hooks/useDynamicData";

function Add({ table_name }) {
    const [isOpen, setIsOpen] = useState(false);
    const { searchConfig } = useSearchConfig();
    const [fieldsData, setFieldsData] = useState([]);
    const [formData, setFormData] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const {createDynamicData} = useDynamicData();

    const getFieldsData = () => {
        try {
            setFieldsData(searchConfig.filter(item => item.table_name === table_name));
        } catch (error) {
            console.log("getFieldsDataError: ", error);
        }
    }

    const getFormData = () => {
        try {
            let _formData = {};
            fieldsData.forEach((item) => {
                _formData[item.field_name] = '';
            });
            setFormData(_formData);
        } catch (error) {
            console.log("getFormDataError: ", error);
        }
    }

    const validateFields = () => {
        let result = true;
        if (formData.password == "") result = false;
        if (formData.name == "" || formData.email == "") result = false;
        fieldsData.forEach((item) => {
            if (item.mandatory && (formData[item.field_name].trim(" ") == "")) result = false;
        })
        return result;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            setSubmitted(true);
            if (!validateFields()) return;
            createDynamicData(table_name, formData);
            setIsOpen(!isOpen);
        } catch (error) {
            console.log("hanleSubmitError: ", error);
        }
    }

    useEffect(() => {
        getFormData();
    }, [fieldsData])

    useEffect(() => {
        getFieldsData();
    }, [searchConfig])

    return (
        <div className="toolbar-left">
            <button onClick={() => setIsOpen(true)} type="button" className="btn btn-primary">
                <span className="btn-icon">＋</span>
                <span className="btn-label">Add</span>
            </button>
            <Modal open={isOpen} onCancel={() => setIsOpen(false)} onOk={handleSubmit}>
                <h1>Add</h1>
                {
                    fieldsData.map((item) => {
                        return <InputGroup props={{ fieldFormat: item, value: formData[item.field_name], handleChange, submitted }} />
                    })
                }
            </Modal>
        </div>
    );
}

export default Add;