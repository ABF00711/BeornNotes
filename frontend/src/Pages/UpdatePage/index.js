import { useMemo } from "react";
import useSearchConfig from "../../Hooks/useSearchConfig";
import "./style.css";
import { useLocation } from "react-router-dom";
import UpdateCustomer from "../../Components/UpdateCustomer";
import Documents from "../../Components/Documents";

function UpdatePage() {
    const location = useLocation();
    const updateData = location.state;
    const { searchConfig } = useSearchConfig();

    const customerData = useMemo(() => {
        const labels = {};
        const mandatories = {};
        searchConfig.map((sc) => {
            if (sc.table_name == "customers") {
                labels[sc.field_name] = sc.field_label;
                mandatories[sc.field_name] = sc.mandatory;
            }
        })
        return { labels, mandatories };
    }, [searchConfig]);

    const documentData = useMemo(() => {
        const labels = {};
        const mandatories = {};
        searchConfig.map((sc) => {
            if (sc.table_name == "documents") {
                labels[sc.field_name] = sc.field_label;
                mandatories[sc.field_name] = sc.mandatory;
            }
        })
        return { labels, mandatories };
    }, [searchConfig]);

    return (
        <div className="updatePage">
            <div className="updatePage-main">
                <UpdateCustomer updateData={updateData} customerData = {customerData} />
                <Documents documentData = {documentData} customer = {updateData?.id} />
            </div>
        </div>
    );
}

export default UpdatePage;