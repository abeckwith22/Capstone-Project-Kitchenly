"use strict"

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");

// Related functions for ingredients.

class Ingredient {
    /** Create an ingredient (from data), update db, return new ingredient data. 
     * data should be { ingredient_name }
     * returns { id, ingredient_name }
    */
    static async create(data) {
        const result = await db.query(
            `INSERT INTO ingredients (ingredient_name)
            VALUES ($1)
            RETURNING id, ingredient_name AS "ingredientName"`, [data.ingredientName]
        );
        let ingredient = result.rows[0];

        return ingredient;
    }

    /** Find all ingredients (optional filter on searchFilters) 
     * searchFilters (all optional)
     * - ingredient_name
     * 
     * returns [{id, ingredient_name}, ...]
    */
    static async findAll() {
        let query = `SELECT id, ingredient_name
                     FROM ingredients;
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

    /** Update ingredient data with ingredient and `data` 
     * This shouldn't be a partial update because we're only changing ingredient_name, can't have duplicates
     * 
     * Data must include { ingredient_name }
     * Returns "updated" { id, ingredient_name } 
     * 
     * Throws BadRequestError if duplicates are found.
     * 
     * Throws NotFoundError if not found.
    */
    static async update(id, { ingredientName }){
        const duplicateCheck = await db.query(`
            SELECT ingredient_name
            FROM ingredients
            WHERE ingredient_name = $1
        `, [ingredientName]);

        if(duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate ingredient name: ${ ingredientName }`);
    
        const querySql = `UPDATE ingredients
                          SET ingredient_name = $2
                          WHERE id = $1
        `;

        const result = await db.query(querySql, [id, ingredientName]);
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
    }
}

module.exports = Ingredient;
