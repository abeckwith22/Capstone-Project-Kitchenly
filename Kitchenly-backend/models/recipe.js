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
     * - TODO: Feature to add tags as an optional parameter to recipes and add to tag_recipe table.
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
     * - [ ] TODO: Add tags feature as a list of tags associated with recipe [{ id, tag_name }, ...]
     * Throws NotFoundError if not found.
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
