import useForm from "../hooks/useForm";
import useAuthContext from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const FormDeleteUser = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
    
    const { handleDeleteUser } = useForm();

    useEffect(() => {
        if(Object.keys(user).length > 0) setLoaded(true);
    }, [user]);

    if(!loaded) return;

    return (
        <div className="ConfirmContainer">
            <div className="ConfirmDiv">
                <div className="ConfirmTitleDiv">
                    <h1 id="confirm-msg">Confirm deletion of {user.username}</h1>
                    <p id="warning-msg">Changes cannot be undone.</p>
                </div>
                <div className="ConfirmFormContainer">
                    <form>
                        <div className="ConfirmForm">
                            <div className="ConfirmInput">
                                <button onClick={() => navigate(`/profile`)} className="ProfileButton EditButton">Cancel</button>
                            </div>
                            <div className="ConfirmInput">
                                <button onClick={handleDeleteUser} className="ProfileButton DeleteButton">Delete user</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormDeleteUser;
