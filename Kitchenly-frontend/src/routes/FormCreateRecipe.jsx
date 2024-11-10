import "../styles/Form.css";
import useForm from "../hooks/useForm";

const FormCreateRecipe = () => {

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


    return (
        <>
            <div className="FormContainer">
                <div className="FormContainerBox">
                    <div className="FormTitleDiv">
                        <h1 className="FormTitle">Create a recipe</h1>
                    </div>
                    <div className="Form">
                        <form onSubmit={handleCreateRecipe}>
                            <div className="FormDiv">
                                <div className="FormInput">
                                    <label htmlFor="title">Title</label>
                                    <input onChange={handleChange} id="title" name="title" required/>
                                </div>
                                <div className="FormInput">
                                    <label htmlFor="description">Description</label>
                                    <input onChange={handleChange} id="description" name="recipe_description" />
                                </div>
                                <div className="FormInput">
                                    <label htmlFor="servings">Ingredients</label>
                                    <input onChange={handleChange} id="ingredients" name="ingredients" />
                                </div>
                                <div className="FormInput">
                                    <label htmlFor="categories">Categories</label>
                                    <input onChange={handleChange} id="categories" name="categories" />
                                </div>
                                <div className="FormInput">
                                    <label htmlFor="tags">Tags</label>
                                    <input onChange={handleChange} id="tags" name="tags" />
                                </div>
                                <div className="FormInput">
                                    <label htmlFor="prep_time">Time to prepare (minutes) </label>
                                    <input type="number" min={0} onChange={handleChange} id="prep_time" name="preparation_time" />
                                </div>
                                <div className="FormInput">
                                    <label htmlFor="cook_time">Time to cook (minutes)</label>
                                    <input type="number" min={0} onChange={handleChange} id="cook_time" name="cooking_time" />
                                </div>
                                <div className="FormSubmit">
                                    <button className="FormButton">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="FormContainer">
                <div className="FormContainerBox">
                    <div className="FormTitleDiv">
                        <h1 className="FormTitle">Ingredients</h1>
                    </div>
                    <div className="Form">
                        <div className="FormDiv">
                            <div className="FormInput">
                                <label htmlFor="ingredient">Ingredient</label>
                                <input type="text" id="ingredient"></input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="FormContainer">
                <div className="FormContainerBox">
                    <div className="FormTitleDiv">
                        <h1 className="FormTitle">Categories</h1>
                    </div>
                    <div className="Form">
                        <div className="FormDiv">
                            <div className="FormInput">
                                <label htmlFor="category">Category</label>
                                <input type="text" id="category"></input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="FormContainer">
                <div className="FormContainerBox">
                    <div className="FormTitleDiv">
                        <h1 className="FormTitle">Add Tags</h1>
                    </div>
                    <div className="Form">
                        <div className="FormDiv">
                            <div className="FormInput">
                                <label htmlFor="tag">Tag</label>
                                <input type="text" id="tag"></input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FormCreateRecipe;
