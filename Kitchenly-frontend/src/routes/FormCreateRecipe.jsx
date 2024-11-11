import "../styles/Form.css";
import useForm from "../hooks/useForm";
import { useState } from "react";
import "../styles/RecipeForm.css";

const FormCreateRecipe = () => {

    const [page, setPageKey] = useState("ingredients");

    const loadIngredients = () => {
        return (
            <div className="">
                <h1>Ingredients page!</h1>
            </div>
        )
    }

    const loadTags = () => {
        return (
            <div className="">
                <h1>Tags page!</h1>
            </div>
        )
    }

    const loadCategories = () => {
        return (
            <div className="">
                <h1>Categories page!</h1>
            </div>
        )
    }


    const INITIAL_DATA = {
        title: "",
        recipe_description: "",
        ingredients: [],
        categories: [],
        tags: [],
        preparation_time:0,
        cooking_time:0,
        servings:0
    }

    const { handleChange, handleCreateRecipe } = useForm(INITIAL_DATA);

    const pages = {
        "ingredient":loadIngredients(),
        "categories":loadCategories(),
        "tags":loadTags(),
    };

    return (
        <>
        <div className="RecipeFormContainerReal">
            <div className="RecipeFormContainer">
                <div className="RecipeForm">
                    <form onSubmit={handleCreateRecipe}>
                        <div className="FormDiv">
                            <div className="FormInput">
                                <label htmlFor="title">Title</label>
                                <input onChange={handleChange} id="title" name="title"/>
                            </div>
                            <div className="FormInput">
                                <label htmlFor="description">Description</label>
                                <input onChange={handleChange} id="description" name="recipe_description"/>
                            </div>
                            <div className="FormInput">
                                <label htmlFor="prep">Preparation time</label>
                                <input onChange={handleChange} id="prep" name="preparation_time"/>
                            </div>
                            <div className="FormInput">
                                <label htmlFor="cook">Cooking time</label>
                                <input onChange={handleChange} id="cook" name="cooking_time"/>
                            </div>
                            <div className="FormInput">
                                <label htmlFor="servings">Servings</label>
                                <input onChange={handleChange} id="servings" name="servings"/>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="ProfileDataContainer">
                    <div className="RecipeFormContainer">
                    </div>
                    <div className="ProfileDataContainerNav">
                        <p className={`NavSlip ${page === "ingredient" ? "selected" : ""}`} onClick={() => setPageKey("ingredient")}>Ingredients</p>
                        <p className={`NavSlip ${page === "categories" ? "selected" : ""}`} onClick={() => setPageKey("categories")}>Categories</p>
                        <p className={`NavSlip ${page === "tags" ? "selected" : ""}`} onClick={() => setPageKey("tags")}>Tags</p>
                    </div>
                    <div className="ProfileDataInfoContainer">
                        {
                            pages[page]
                        }
                    </div>
                </div>

                <div className="RecipePreview">
                </div>
            </div>
        </div>
        </>
    );
}

export default FormCreateRecipe;
