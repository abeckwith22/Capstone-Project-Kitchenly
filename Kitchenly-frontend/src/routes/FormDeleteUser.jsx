import useForm from "../hooks/useForm";
import useAuthContext from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const FormDeleteUser = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const { handleDeleteUser } = useForm();

    return (
        <div className="FormContainer">
            <div className="FormContainerBox">
                <div className="FormTitleDiv">
                    <h1 className="FormTitle">Confirm deletion of {user.username}</h1>
                    <p>Changes cannot be undone.</p>
                </div>
                <div className="Form">
                    <form onSubmit={handleDeleteUser}>
                        <div className="FormDiv">
                            <div className="FormSubmit">
                                <button onClick={() => navigate("/profile")} className="ProfileButton EditButton">Cancel</button>
                            </div>
                            <div className="FormSubmit">
                                <button className="ProfileButton DeleteButton">Delete user</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormDeleteUser;
