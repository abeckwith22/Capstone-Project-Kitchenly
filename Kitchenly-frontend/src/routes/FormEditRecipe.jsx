import "../styles/Form.css";
import useForm from "../hooks/useForm";
import usePreview from "../hooks/usePreview";
import { useState, useEffect } from "react";
import "../styles/RecipeForm.css";
import ListComponent from "../components/ListComponent";
import KitchenlyApi from "../../api";
import { useLocation } from "react-router-dom";

const FormEditRecipe = () => {

    const { state } = useLocation();
    const { recipe } = state;
    const [page, setPageKey] = useState("ingredient");

    const [ingredients, setIngredients] = useState([...recipe.ingredients.map(i => i.ingredient_name)]);
    const [tags, setTags] = useState([...recipe.tags.map(t => t.tag_name)]);
    const [loaded, setLoaded] = useState(true);
    
    useEffect(() => {
        const getAll = async () => {
            setLoaded(true);
            console.debug(recipe);
        }
        getAll();
    }, []);

    const INITIAL_DATA = {
        title: recipe.title,
        recipe_description: recipe.recipe_description,
        preparation_time:recipe.preparation_time,
        cooking_time:recipe.cooking_time,
        servings:recipe.servings,
        ingredient_name: "",
        tag_name: "",
        ingredients: ingredients,
        tags: tags,
    }

    const { handleChange, handleEditRecipe, createRecipeDraft, formData, setFormData} = useForm(INITIAL_DATA);

    const handleRemove = (name="", type="") => {
        if(type === "ingredient"){
            const copy = ingredients.filter(i => i !== name);
            setIngredients(copy);
        }
        if(type === "tag"){
            const copy = tags.filter(t => t !== name);
            setTags(copy);
        }
    }

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
                    <ListComponent key="ingredients" handleRemove={handleRemove} items={ingredients} type="ingredient"/>
                </div>
            </>
        );
    };
    
    const tagsPage= () => {
        return (
            <div className="options-list">
                {addItemForm("tag")}
                <ListComponent key="tags" handleRemove={handleRemove} items={tags} type="tag"/>
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
                                    <button className="FormSubmit" onClick={(e) => handleEditRecipe(e, recipe.id, ingredients, tags)}>Submit</button>
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

export default FormEditRecipe;
