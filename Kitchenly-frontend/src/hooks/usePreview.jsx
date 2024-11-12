import "../styles/Details.css";

const usePreview = (recipe) => {

    const formatDate = (time) => {
        const date = new Date(time);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDay();
        const hour = date.getHours();
        const second = date.getSeconds();

        const formatted_date = `${day}/${month}/${year} @ ${hour}:${second}`;

        return formatted_date;
    }

    return (
        <div className="RecipeDetailContainer">
            <div id={recipe.id} className="Detail">
                <div className="DetailMeta">
                    <div className="DetailHeader">
                        <h1 id="RecipeDetailTitle">{recipe.title ? recipe.title : "Title"}</h1>
                        <div className="DetailCategories">
                            {recipe.categories && recipe.categories.length > 0 ? (
                                recipe.categories.map(c => (
                                    <span>{c}</span>
                                ))
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                    <div className="FavoriteContainer">
                        <div className="Favorite RecipeIsFavorite">
                            <span id="starTrue">&#9733;</span>
                        </div>
                    </div>
                    <p><span className="DetailMetaUser">@username</span> <span className="DetailMetaTime">1/1/1970 @ 00:00</span></p>
                    <div className="DetailTags">
                        <p>
                            {recipe.tags.length > 0 ? (
                                recipe.tags.map(t => (
                                    <span>#{t} </span>
                                ))
                            ) : (
                                ""
                            )}
                        </p>
                    </div>
                </div>
                <br></br>
                <hr></hr>
                <div className="DetailInfo">
                    <div className="PreInfoDiv">
                        <h3>Before you start</h3>
                        <div className="PreInfo">
                            <p>Preparation Time: {recipe.preparation_time} minutes</p>
                            <p>Cooking Time: {recipe.cooking_time} minutes</p>
                            <p>Serves {recipe.servings} people</p>
                        </div>
                    </div>
                    <div className="DetailIngredientDiv">
                        <h3>Ingredients</h3>
                        <div className="DetailIngredients">
                            {recipe.ingredients.length > 0 ? (
                                recipe.ingredients.map(i => (
                                    <p>{i}</p>
                                ))
                            ) : (
                                ""
                            )}
                        </div>
                    </div>

                    <div className="DetailDescription">

                        <p>{recipe.recipe_description ? recipe.recipe_description : `Dolorem ipsum dolor. 
                        Et praesentium labore officiis fugit sint nihil. Distinctio iste vitae quisquam accusantium repellat vel eos. 
                        Quia illum atque dolore cupiditate ea. 
                        Non magnam deleniti cupiditate labore doloribus eius natus. 
                        Animi deserunt asperiores corrupti minus officia ut quis. 
                        Perspiciatis optio sed nobis. 
                        Amet alias soluta perferendis occaecati reiciendis. 
                        Aspernatur et neque repellat necessitatibus molestias non. 
                        Voluptas reiciendis deserunt. Sint iure est eveniet. 
                        Enim totam provident nesciunt distinctio consequuntur sunt. 
                        Quia odit velit dolor reiciendis dolores modi ad incidunt qui. 
                        Est omnis doloribus minima neque iure esse et. 
                        Dolorum odio animi veniam ut fugiat.`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default usePreview;
