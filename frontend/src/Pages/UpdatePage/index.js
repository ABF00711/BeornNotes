import { useMemo, useEffect, useContext } from "react";
import useSearchConfig from "../../Hooks/useSearchConfig";
import "./style.css";
import { useLocation } from "react-router-dom";
import UpdateCustomer from "../../Components/UpdateCustomer";
import Documents from "../../Components/Documents";
import { MyContext } from "../../Context";

const tabBtnData = {
    id: 100,
    title: "Edit",
    active: true,
    icon: "",
    path: "/updateCustomer",
    screen_id: "udpateCustomer",
}

function UpdatePage() {
    const location = useLocation();
    const updateData = location.state || JSON.parse(localStorage.getItem("customerDataForUpdate"));
    const { searchConfig } = useSearchConfig();
    const {setCurrentInterface} = useContext(MyContext);

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

    useEffect(() => {
        if (updateData) {
            localStorage.setItem("customerDataForUpdate", JSON.stringify(updateData));
        }
    }, [updateData])

    useEffect(() => {
        setCurrentInterface(prev => {
            const exists = prev.tabbedBtns.find(item => item.id === tabBtnData.id);
            prev.tabbedBtns = exists ? prev.tabbedBtns : [...prev.tabbedBtns, tabBtnData];
            prev.activeUrl = tabBtnData.path;
            return prev;
        });
    }, [])

    return (
        <div className="updatePage">
            <div className="updatePage-main">
                <UpdateCustomer updateData={updateData} customerData={customerData} />
                <Documents documentData={documentData} customer={updateData?.id} />
            </div>
        </div>
    );
}

export default UpdatePage;