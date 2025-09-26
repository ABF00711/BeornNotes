import React, { useEffect, useState } from "react";
import "./style.css";
import DynamicModal from "../DynamicModal";
import useSearchConfig from "../../Hooks/useSearchConfig";

function Update({tablename, isOpen, setIsOpen, updateData}) {
    const { searchConfig } = useSearchConfig();
    const [fieldsData, setFieldsData] = useState([]);
    const [formData, setFormData] = useState({});

    const getFormData = () => {
        try {
            if(!updateData){
                setFormData({});
                return;
            }
            const pickedData = updateData;
            fieldsData.forEach(element => {
                if(element.field_type === "date"){
                    if(!pickedData[element.field_name]) return;
                    pickedData[element.field_name] = pickedData[element.field_name].split("T")[0];
                }
            });
            setFormData(pickedData);
        } catch (error) {
            console.log("getFormDataError: ", error);
        }
    }

    useEffect(() => {
        getFormData();
    }, [updateData])

    useEffect(() => {
        setFieldsData(searchConfig.filter(item => item.table_name === tablename));
    }, [searchConfig])

    return (
        <>
            <DynamicModal
                table_name={tablename} isOpen={isOpen} setIsOpen={setIsOpen}
                title={"Edit"} role={"update"}
                fieldsData={fieldsData} initData = {formData}
            />
        </>
    );
}

export default Update;