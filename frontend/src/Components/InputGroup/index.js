import React, { useEffect, useState } from "react";
import "./style.css";
import services from "../../Services";
import Combobox from "../Combobox";
import Popup from "../Popup";

function InputGroup({ props }) {
    const { fieldFormat, value, handleChange, submitted = false } = props;
    const [popupData, setPopupData] = useState([]);
    const [comboboxData, setComboboxData] = useState([]);

    const getOptionData = async () => {
        try {
            if(fieldFormat.field_type == "combobox"){
                const res = await services.getOptionData(fieldFormat.lookup_sql);
                setComboboxData(res.optionData);
            }
            if(fieldFormat.field_type == "popup"){
                const res = await services.getOptionData(fieldFormat.lookup_sql);
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
                submitted={submitted}
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
                submitted={submitted}
            />
        );
    }

    const invalid = fieldFormat.mandatory && submitted && (!value || String(value).trim() === "");
    return (
        <div className="input-group">
            <div className="field row">
                <label htmlFor={fieldFormat.field_name} className="field-label">{fieldFormat.field_label}</label>
                <input
                    id={fieldFormat.field_name}
                    type={fieldFormat.field_type}
                    name={fieldFormat.field_name}
                    className={`field-input ${invalid ? "field-input--invalid" : ""}`}
                    value={value}
                    onChange={handleChange}
                    autoComplete="off"
                />
                {fieldFormat.mandatory ? " *" : ""}
            </div>
        </div>
    );
}

export default InputGroup;