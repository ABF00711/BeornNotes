import React, { useEffect, useState } from "react";
import "./style.css";
import services from "../../Services";
import Combobox from "../Combobox";
import Popup from "../Popup";

function InputGroup({ props }) {
    const { fieldFormat, value, handleChange } = props;
    const [popupData, setPopupData] = useState([]);
    const [comboboxData, setComboboxData] = useState([]);

    const getOptionData = async () => {
        try {
            const res = await services.getOptionData(fieldFormat.lookup_sql);
            if(fieldFormat.field_type == "combobox"){
                setComboboxData(res.optionData);
            }
            if(fieldFormat.field_type == "popup"){
                setPopupData(res.optionData);
            }
        } catch (error) {
            console.log("getOptionDataError: ", error);
        }
    }

    useEffect(() => {
        getOptionData();
    }, [])

    if (fieldFormat.field_type == "combobox") {
        return (
            <Combobox
                key={fieldFormat.id}
                fieldFormat={fieldFormat}
                value={value}
                handleChange={handleChange}
                options={comboboxData}
            />
        );
    }

    if (fieldFormat.field_type == "popup") {
        return (
            <Popup
                key={fieldFormat.id}
                fieldFormat={fieldFormat}
                value={value}
                handleChange={handleChange}
                options={popupData}
            />
        );
    }

    return (
        <div className="input-group" style={fieldFormat.mandatory && value ? {borderColor: "red"} : {}}>
            <input
                type={fieldFormat.field_type}
                name={fieldFormat.field_name}
                placeholder={fieldFormat.field_label}
                className="auth-input"
                value={value}
                onChange={handleChange}
                required={fieldFormat.mandatory}
            />
        </div>
    );
}

export default InputGroup;