import { useState } from "react";
import useSearchConfig from "../../Hooks/useSearchConfig";
import useDynamicData from "../../Hooks/useDynamicData";

function AddDocument ({formName, customerData}) {
     const {tableNames} = useDynamicData();
    const { searchConfig } = useSearchConfig();
    const [fieldsData, setFieldsData] = useState([]);
    const [formData, setFormData] = useState({});
    const [isOpen, setIsOpen] = useState(false);

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
    
    useEffect(() => {
        getFormData();
    }, [fieldsData])
    
    useEffect(() => {
        if(!searchConfig) return;
        setFieldsData(searchConfig.filter(item => item.table_name === tableNames[formName]));
    }, [searchConfig, tableNames])

    return (
        <>
            <button onClick={() => setIsOpen(true)} type="button" className="btn btn-primary">
                <span className="btn-icon">＋</span>
                <span className="btn-label">Add</span>
            </button>
            <DynamicModal
                table_name={tableNames?.[formName] ?? ""}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                role={"create"}
                initData={formData}
                customerData = {customerData}
            />
        </>
    );
}

export default AddDocument;