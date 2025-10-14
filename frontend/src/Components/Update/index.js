import React, { useEffect, useState } from "react";
import "./style.css";
import DynamicModal from "../DynamicModal";
import useSearchConfig from "../../Hooks/useSearchConfig";
import useDynamicData from "../../Hooks/useDynamicData";

function Update({formName, isOpen, setIsOpen, updateData}) {
    const {tableNames} = useDynamicData();
    const { searchConfig } = useSearchConfig();
    const [fieldsData, setFieldsData] = useState([]);
    const [formData, setFormData] = useState({});

    const getFormData = () => {
        try {
            if(!updateData){
                setFormData({});
                return;
            }
            if(updateData.age == 0) updateData.age = null;
            setFormData(updateData);
        } catch (error) {
            console.log("getFormDataError: ", error);
        }
    }

    useEffect(() => {
        getFormData();
    }, [updateData])

    useEffect(() => {
        setFieldsData(searchConfig.filter(item => item.table_name === tableNames[formName]));
    }, [searchConfig])

    return (
        <>
            <DynamicModal
                table_name={tableNames[formName]} isOpen={isOpen} setIsOpen={setIsOpen}
                title={"Edit"} role={"update"}
                fieldsData={fieldsData} initData = {formData}
            />
        </>
    );
}

export default Update;