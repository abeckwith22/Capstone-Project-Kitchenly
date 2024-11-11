import useForm from "../hooks/useForm";
import useAuthContext from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Confirm.css";

const FormDeleteRecipe = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { recipe } = state;
    const [loaded, setLoaded] = useState(false);

    
    const INITIAL_DATA = {
        recipe_id: recipe.id,
    }

    const { handleDeleteRecipe } = useForm(INITIAL_DATA);
    
    useEffect(() => {
        if(Object.keys(user).length > 0) setLoaded(true);
    }, [user]);
    
    if(!loaded) return;

    
    return (
        <div className="ConfirmContainer">
            <div className="ConfirmDiv">
                <div className="ConfirmTitleDiv">
                    <h2 id="confirm-msg">Confirm deletion of recipe?</h2>
                    <p id="warning-msg">This action cannot be undone.</p>
                </div>
                <div className="ConfirmFormContainer">
                    <form onSubmit={handleDeleteRecipe}>
                        <div className="ConfirmForm">
                            <div className="ConfirmInput">
                                <button onClick={() => navigate(`/recipes/${recipe.id}`, { state: { recipe }})} className="cancel">Cancel</button>
                            </div>
                            <div className="ConfirmInput">
                                <button className="confirm">Delete Recipe</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FormDeleteRecipe;
