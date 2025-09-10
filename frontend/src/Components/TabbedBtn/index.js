import { useNavigate } from "react-router-dom";
import "./style.css"
import useTabbedBtns from "../../Hooks/useTabbedBtns";

function TabbedBtn ({btnInfo}) {
    const navigate = useNavigate();
    const {removeTabbedBtn} = useTabbedBtns();

    const onNavigate = () => {
        console.log("btnInfo: ", btnInfo);
        navigate(btnInfo.path);
    }

    const removeBtn = () => {
        removeTabbedBtn(btnInfo);
    }

    return (
        <div className={`tabbedBtn ${btnInfo.active} ? active-tabbedBtn : `} >
            <label onClick={onNavigate}>{btnInfo.title}</label><label className="removeBtn" onClick={removeBtn}>✖</label>
        </div>
    );
}

export default TabbedBtn;