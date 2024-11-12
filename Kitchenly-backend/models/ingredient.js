"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");

// Related functions for ingredients.

class Ingredient {
    /** Create an ingredient(s) (from data), update db, return new array of ingredients. 
     * data should be [{ ingredient_name }, ...]
     * returns [{ id, ingredient_name }, ...]
    */
    static async createMultiple(data) {
        // if data is empty/doesn't exist and it's length is zero
        // if(!data || !data.length > 0) throw new BadRequestError("Invalid/Empty data passed:", data);

        const sqlValues = this.formatInsert(data.ingredient_names);

        const result = await db.query(
            `INSERT INTO ingredients (ingredient_name)
            VALUES ${sqlValues}
            RETURNING *`, [...data.ingredient_names]
        );

        let ingredients = result.rows;

        // console.debug(ingredients);

        return ingredients;
    }

    /** Search database for ingredient_name (has to be exact), if found, return it, otherwise create
     * the ingredient and return the object.
     */
    static async create(data) {
        const name = data.ingredient_name;
        const selectQuery = `
            SELECT *
            FROM ingredients
            WHERE ingredient_name=$1
        `;

        const selectResult = await db.query(selectQuery, [name]);

        if(selectResult.rows[0]) return selectResult.rows[0]; // meaning this ingredient doesn't exist.

        const insertQuery = `
            INSERT INTO ingredients (ingredient_name)
            VALUES ($1)
            RETURNING *
        `;

        const insertResult = await db.query(insertQuery, [name]);

        let ingredients = insertResult.rows[0];

        return ingredients;
    }

    /** quick helper method to insert values into create method for ingredients */
    static formatInsert (values) {
        let idx = 1;
        let sqlInsert = ""
        for(let i=0; i < values.length; i++){
            if(i+1===values.length) sqlInsert += `( $${idx} )`
            else sqlInsert += `( $${idx} ),`
            idx++;
        }
        return sqlInsert;
    }

    /** Find all ingredients (optional filter on searchFilters) 
     * 
     * returns [{id, ingredient_name}, ...]
    */
    static async findAll(ingredient_name) {
        let query = `SELECT id, ingredient_name
                     FROM ingredients
        `;
        let whereExpressions = [];
        let queryValues = [];

        // For each possible search term, add to whereExpresions and
        // queryValues so we can generate the right SQL

        if(ingredient_name !== undefined){
            queryValues.push(`%${ingredient_name}`);
            whereExpressions.push(`ingredient_name ILIKE $${queryValues.length}`);
        }
        if(whereExpressions.length > 0){
            query += " WHERE " + whereExpressions.join(" AND ");
        }

        // Finalize query and return results

        query += " ORDER BY ingredient_name"
        console.debug(query);
        const ingredientRes = await db.query(query, queryValues);
        return ingredientRes.rows;
    }

    /** Given a ingredient id, return data about ingredient.
     * Returns { id, ingredient_name }
     * 
     * Throws NotFoundError if not found.
     */
    static async get(id) {
        const ingredientRes = await db.query(`
            SELECT id,
                   ingredient_name
            FROM ingredients
            WHERE id = $1
        `, [id]);

        const ingredient = ingredientRes.rows[0];

        if(!ingredient) throw new NotFoundError(`No ingredient: ${id}`);

        return ingredient;
    }

    /** Update ingredient data with ingredient id and `data` 
     * This shouldn't be a partial update because we're only changing ingredient_name, can't have duplicates
     * 
     * Data must include { ingredient_name }
     * Returns "updated" { id, ingredient_name } 
     * 
     * Throws BadRequestError if duplicates are found.
     * 
     * Throws NotFoundError if not found.
    */
    static async update(id, { ingredient_name }){
        const duplicateCheck = await db.query(`
            SELECT ingredient_name
            FROM ingredients
            WHERE ingredient_name = $1
        `, [ingredient_name]);

        if(duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate ingredient name: ${ ingredient_name }`);
    
        const querySql = `UPDATE ingredients
                          SET ingredient_name = $2
                          WHERE id = $1
                          RETURNING id,
                                    ingredient_name
        `;

        const result = await db.query(querySql, [id, ingredient_name]);
        const ingredient = result.rows[0];

        if(!ingredient) throw new NotFoundError(`No ingredient: ${id}`);

        return ingredient;
    }

    /** Delete given ingredient from database; returns undefined.
     * 
     * Throws NotFoundError if ingredient not found.
     * 
    */
    static async remove(id){
        const result = await db.query(`
            DELETE
            FROM ingredients
            WHERE id = $1
            RETURNING id
            `, [id]);
        const ingredient = result.rows[0];

        if(!ingredient) throw new NotFoundError(`No ingredient: ${id}`);
        return { id: id, message: "Ingredient deleted successfully!"};
    }

    static async ingredientToRecipe(ingredient_id, recipe_id){
    }
}

module.exports = Ingredient;
