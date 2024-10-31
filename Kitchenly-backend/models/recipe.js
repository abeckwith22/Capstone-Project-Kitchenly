"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

class Recipe {

    /** Create a recipe (from data), update db, return new recipe data.
     * 
     * data should be { username, title, recipe_description, preparation_time, cooking_time, servings }
     *  - FIX: username shouldn't be added by user itself! But when a (form lets say) is submitted, should get current_user.username and set that as the request
     *          or should do something else to get logged in users username.
     * - NOTE: recipe_description, preparation_time, cooking_time, and servings are all allowed to be null
     * 
     * Returns { id, username, title, recipe_description, preparation_time, cooking_time, servings }
     * 
    **/
    static async create(data){
        if(!data.username || !data.title){
            throw new BadRequestError("no username/title");
        }

        const result = await db.query(`
            INSERT INTO recipes (username,
                                title,
                                recipe_description,
                                preparation_time,
                                cooking_time,
                                servings)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, username, title, recipe_description, preparation_time, cooking_time, servings
        `, [
            data.username,
            data.title,
            data.recipe_description || null,
            data.preparation_time || null,
            data.cooking_time || null,
            data.servings || null,
        ]);

        let recipe = result.rows[0];

        return recipe;
    };


    /** Find all recipes.
     * Returns [{ id, username, title, recipe_description, preparation_time, cooking_time, servings, created_at }, ...]
    **/
    static async findAll() {
        const result = await db.query(`
            SELECT id,
                   username,
                   title,
                   recipe_description,
                   preparation_time,
                   cooking_time,
                   servings,
                   created_at
            FROM recipes
            ORDER BY username`
        );
        return result.rows;
    };

    /** Given a recipe title, return data about recipe.
     * 
     * returns { id, username, title, description, preparation_time, cooking_time, servings, created_at };
     * 
     * Throws NotFoundError if not found.
     * - [ ] TODO: Add an ingredients join so that it lists the ingredients provided for the actual recipe.
     * 
    **/
    static async get(id){
        const recipeRes = await db.query(`
            SELECT id,
                   username,
                   title,
                   recipe_description,
                   preparation_time,
                   cooking_time,
                   servings,
                   created_at
            FROM recipes
            WHERE id = $1
            `, [id]
        );

        const recipe = recipeRes.rows[0];

        if(!recipe) throw new NotFoundError(`No recipe id: ${id}`);

        return recipe;
    };

    /** Update recipe data with `data`.
     * 
     * This is a "partial update" --- it's fine if data doesn't contain all
     * the fields; this only changes provided ones.
     * 
     * Data can include: { title, description, preparation_time, cooking_time, servings }
     * 
     * Returns: updated { id, username, title, recipe_description, preparation_time, cooking_time, servings, created_at };
     * 
    **/
    static async update(id, data) {
        if(data.username || data.id) throw new BadRequestError("Invalid data", data);

        const { setCols, values } = sqlForPartialUpdate(data, {});
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE recipes
                          SET ${setCols}
                          WHERE id = ${idVarIdx}
                          RETURNING id,
                                    username,
                                    title,
                                    recipe_description,
                                    preparation_time,
                                    cooking_time,
                                    servings,
                                    created_at
        `
        const result = await db.query(querySql, [...values, id]);

        const recipe = result.rows[0];

        if(!recipe) throw new NotFoundError(`No recipe: ${id}`);

        return recipe;
    };

    /** Quick helper function to return a string for formatting insertion values into an sql query that node-pg can recognize */
    static formatInsert(values){
        let idx = 2; // $1 is saved for recipe_id
        let sqlInsert = "";
        for(let i=0; i < values.length; i++){
            if(i+1===values.length){
                sqlInsert += ` ( $1, $${idx} )`
            }else {
                sqlInsert += ` ( $1, $${idx} ),`
            }
            idx++;
        }
        return sqlInsert;
    }

    /** Quick helper function to return a string for formatting query values into an sql query that node-pg can recognize */
    static formatWhere(values, key, value){
        let idx = 1;
        let sqlWhere = "";
        for(let i=0; i < values.length; i++){
            if(i===0) sqlWhere += "WHERE ";
            else sqlWhere += " AND ";
            sqlWhere += `${key}.${value}=$${idx}`
            idx++;
        }

        return sqlWhere;
    }

    static formatIn(values){
        let idx = 1;
        let sqlWhere = "(";
        for(let i=0; i < values.length; i++){
            if(i===0 && values.length > 1) sqlWhere += `$${idx}, `
            else if(i+1=== values.length) sqlWhere += `$${idx}`
            idx++;
        }
        sqlWhere += ")";
        // console.debug(`*${sqlWhere}*`)
        return sqlWhere;
    }

    /** Creates recipe-to-category relationship in recipes_categories 
     * - recipe_id: Id of recipe
     * - category_ids: Array of category_ids
     * 
     * returns { recipe_id: recipe_id, category_id: category_id, message: "recipe-to-category relationship created successfully"}
     * 
     * Throws BadRequestError if recipe/category id doesn't exist
     * Throws NotFoundError if either recipe or category id cannot be found.
     * 
    */
    static async setRecipeToCategory(recipe_id, category_ids){
        if(!recipe_id || !category_ids) throw new BadRequestError("No recipe_id or category_ids");

        const sqlValues = this.formatInsert(category_ids);

        const sqlQuery = `
            INSERT INTO recipes_categories (recipe_id, category_id)
            VALUES ${sqlValues}
            RETURNING recipe_id, category_id
        `

        // console.debug(sqlQuery);

        const result = await db.query(sqlQuery, [recipe_id, ...category_ids]);

        // console.debug(result);

        return { category_ids: category_ids, recipe_id, message: "recipes-to-categories relationships created successfully" };
    }

    /** Creates tag-to-recipe relationship in tags_recipes
     * - recipe_id: Id of recipe
     * - tag_ids: Array of tag_ids
     * 
     * returns { recipe_id: recipe_id, tag_ids: tag_ids, message: "recipe-to-category relationship created successfully"}
     * 
     * Throws BadRequestError if tag-to-recipe relationship already exists.
     * Throws NotFoundError if either recipe or tag id cannot be found.
     * 
    */
    static async setTagsToRecipe(tag_ids, recipe_id){
        if(!recipe_id || !tag_ids) throw new BadRequestError("No recipe_id or tag_ids");

        const sqlValues = this.formatInsert(tag_ids);

        const sqlQuery = `
            INSERT INTO tags_recipes (recipe_id, tag_id)
            VALUES ${sqlValues}
            RETURNING tag_id, recipe_id
        `

        // console.debug(sqlQuery);

        const result = await db.query(sqlQuery, [recipe_id, ...tag_ids]);

        // console.debug(result);

        return { tag_ids: tag_ids, recipe_id, message: "tags-to-recipes relationships created successfully" };
    }

    /** Retrives recipes from db with category or categories
     * Throws NotFoundError if categor(y/ies) doesn't exist
     *  - Note: For an array of category, if one category id doesn't exist, but another does, it shouldn't return a NotFoundError.
     *              at least that's what I'd like to implement...
    */
    static async getRecipesByCategory(category_ids){
        if(!category_ids || !Array.isArray(category_ids) || category_ids.length === 0) throw new BadRequestError("No category data");
        const exists = await db.query(`
            SELECT id
            FROM categories
            WHERE id = ANY($1)
        `, [category_ids]);

        if(exists.rows.length !== category_ids.length) throw new BadRequestError("Tag(s) are not found in database"); // meaning there's a tag that doesn't exist in db

        const sqlWhere = this.formatIn(category_ids);
        const sqlQuery = `
            SELECT recipes.*
            FROM recipes
            JOIN recipes_categories ON recipes.id = recipes_categories.recipe_id
            WHERE recipes_categories.category_id IN ${sqlWhere}
            GROUP BY recipes.id
            HAVING COUNT(DISTINCT recipes_categories.category_id) = ${category_ids.length}
        `

        const result = await db.query(sqlQuery, [...category_ids]);

        const recipes = result.rows;

        return recipes;
    }

    /** Retrives recipes from db with tag or tags 
     * Throws NotFoundError if tag(s) doesn't exist
     *  - Note: For an array of tags, if one tag id doesn't exist, but another does, it shouldn't return a NotFoundError.
     *              at least that's what I'd like to implement...
    */
    static async getRecipesByTags(tag_ids){ // - [ ] For now stick with 1 tag
        if(!tag_ids || !Array.isArray(tag_ids) || tag_ids.length === 0) throw new BadRequestError("No tag ids");
        const exists = await db.query(`
            SELECT id
            FROM tags
            WHERE id = ANY($1)
        `, [tag_ids]);

        if(exists.rows.length !== tag_ids.length) throw new BadRequestError("Tag(s) not found in database"); // meaning there's a tag that doesn't exist in db

        const sqlWhere = this.formatIn(tag_ids);

        const sqlQuery = `
            SELECT recipes.*
            FROM recipes
            JOIN tags_recipes ON recipes.id = tags_recipes.recipe_id
            WHERE tags_recipes.tag_id IN ${sqlWhere}
            GROUP BY recipes.id
            HAVING COUNT(DISTINCT tags_recipes.tag_id) = ${tag_ids.length}
        `;

        const result = await db.query(sqlQuery, [...tag_ids]);

        const recipes = result.rows;

        return recipes;
    }

    /** Delete give recipe from database; returns success message.
     * 
     * Throws NotFoundError if company not found.
    **/
    static async remove(id){
        const result = await db.query(`
            DELETE
            FROM recipes
            WHERE id = $1
            RETURNING username, title
        `, [id]);

        const recipe = result.rows[0];

        if(!recipe) throw new NotFoundError(`No recipe: ${id}`);
        return { id, username: recipe.username, title: recipe.title, message: "Recipe deleted successfully!" };
    };
}

module.exports = Recipe;
