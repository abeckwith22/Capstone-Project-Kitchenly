import "../styles/Form.css";
import useForm from "../hooks/useForm";
import usePreview from "../hooks/usePreview";
import { useState, useEffect } from "react";
import "../styles/RecipeForm.css";
import ListComponent from "../components/ListComponent";
import KitchenlyApi from "../../api";

const FormCreateRecipe = () => {

    const [page, setPageKey] = useState("ingredient");

    const [ingredients, setIngredients] = useState([]);
    const [tags, setTags] = useState([]);
    const [loaded, setLoaded] = useState(true);
    
    // const INITIAL_DATA = {
    //     title: "",
    //     recipe_description: "",
    //     preparation_time:0,
    //     cooking_time:0,
    //     servings:0,
    //     ingredient_name: "",
    //     tag_name: "",
    //     ingredients: [],
    //     tags: [],
    // }

    const INITIAL_DATA_COPY = {
        title: "Title",
        recipe_description: "Description",
        preparation_time:10,
        cooking_time:10,
        servings:10,
        ingredient_name: "",
        tag_name: "",
        ingredients: [],
        tags: [],
    }

    const { handleChange, handleCreateRecipe, createRecipeDraft, formData, setFormData} = useForm(INITIAL_DATA_COPY);
    
    useEffect(() => {
        const getAll = async () => {
            setIngredients([]);
            setTags([]);
            setLoaded(true);
        }
        getAll();
    }, []);

    const handleAddIngredient = e => {
        e.preventDefault();
        const { name, value } = e.target[0];
        if(value.length !== 0 && !ingredients.includes(value)){
            const copy = [...ingredients];
            copy.push(value);
            setIngredients(copy);
            const fd = formData;
            fd.ingredient_name = "";
            setFormData(fd);
        }
    }

    const handleAddTag = e => {
        e.preventDefault();
        const { name, value } = e.target[0];
        if(value.length !== 0 && !tags.includes(value)){
            const copy = [...tags];
            copy.push(value);
            setTags(copy);
            const fd = formData;
            fd.tag_name = "";
            setFormData(fd);
        }
    }

    const handles = {
        "ingredient":handleAddIngredient,
        "tag":handleAddTag,
    }

    if(!loaded) return;

    const addItemForm = (name) => {
        return (
            <form className="AddItemForm" onSubmit={handles[name]}>
                <input className="RecipeInput" onChange={handleChange} min={1} type="text" name={`${name}_name`} placeholder={`Add ${name}`} value={formData[`${name}_name`]}/>
                <button className="FormSubmit">+</button>
            </form>
        )
    }

    const ingredientsPage = () => {
        return (
            <>
                <div className="options-list">
                    {addItemForm("ingredient")}
                    <ListComponent items={ingredients}/>
                </div>
            </>
        );
    };
    
    const tagsPage= () => {
        return (
            <div className="options-list">
                {addItemForm("tag")}
                <ListComponent items={tags}/>
            </div>
        );
    };

    const pages = {
        "ingredient":ingredientsPage(),
        "tags":tagsPage(),
    };

    return (
        <>
            <div className="RecipeFormContainerReal">
                <div className="RecipeFormContainer">
                    <div className="RecipeForm">
                        <form>
                            <div className="FormDiv">
                                <div className="FormInput">
                                    <label htmlFor="title">Title</label>
                                    <input onChange={handleChange} id="title" name="title" value={formData.title}/>
                                </div>
                                <div className="FormInput">
                                    <label htmlFor="description">Description</label>
                                    <input onChange={handleChange} id="description" name="recipe_description" value={formData.recipe_description}/>
                                </div>
                                <div className="FormInput">
                                    <label htmlFor="prep">Preparation time</label>
                                    <input onChange={handleChange} id="prep" name="preparation_time" value={formData.preparation_time}/>
                                </div>
                                <div className="FormInput">
                                    <label htmlFor="cook">Cooking time</label>
                                    <input onChange={handleChange} id="cook" name="cooking_time" value={formData.cooking_time}/>
                                </div>
                                <div className="FormInput">
                                    <label htmlFor="servings">Servings</label>
                                    <input onChange={handleChange} id="servings" name="servings" value={formData.servings}/>
                                </div>
                                <div className="FormInput">
                                    <button className="FormSubmit" onClick={(e) => handleCreateRecipe(e, ingredients, tags)}>Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="ProfileDataContainer">
                        <div className="ProfileDataContainerNav">
                            <p className={`NavSlip ${page === "ingredient" ? "selected" : ""}`} onClick={() => setPageKey("ingredient")}>Ingredients</p>
                            <p className={`NavSlip ${page === "tags" ? "selected" : ""}`} onClick={() => setPageKey("tags")}>Tags</p>
                        </div>
                        <div className="ProfileDataInfoContainer">
                            {
                                pages[page]
                            }
                        </div>
                    </div>
                </div>
                <div className="RecipePreview">
                    {usePreview(createRecipeDraft(ingredients, tags))}
                </div>
            </div>
        </>
    );
}

export default FormCreateRecipe;
