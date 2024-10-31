"use strict"

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");

// Related functions for categories.

class Category {
    /** Create an category (from data), update db, return new category data. 
     * data should be { category_name }
     * returns { id, category_name }
    */
   static async create(data) {
       const result = await db.query(
           `INSERT INTO categories (category_name)
           VALUES ($1)
           RETURNING id, category_name`, [data.category_name]
        );
        let category = result.rows[0];
        
        return category;
    }
    
    /** Find all categories (optional filter on searchFilters) 
     * searchFilters (all optional)
     * - category_name
     * 
     * returns [{id, category_name}, ...]
    */
   static async findAll(category_name) {
       let query = `SELECT id, category_name
       FROM categories
       `;
       let whereExpressions = [];
       let queryValues = [];
       
       // For each possible search term, add to whereExpresions and
       // queryValues so we can generate the right SQL
       
       if(category_name !== undefined){
           queryValues.push(`%${category_name}`);
           whereExpressions.push(`category_name ILIKE $${queryValues.length}`);
        }
        if(whereExpressions.length > 0){
            query += " WHERE " + whereExpressions.join(" AND ");
        }
        
        // Finalize query and return results
        
        query += " ORDER BY category_name"
        const categoryRes = await db.query(query, queryValues);
        return categoryRes.rows;
    }
    
    /** Given a category id, return data about category.
     * Returns { id, category }
     * 
     * Throws NotFoundError if not found.
     * 
    */
   static async get(id) {
       const categoryRes = await db.query(`
        SELECT id,
        category_name
        FROM categories
        WHERE id = $1
        `, [id]);
        
        const category = categoryRes.rows[0];
        
        if(!category) throw new NotFoundError(`No category: ${id}`);
        
        return category;
    }

    /** Update category data with id and `data` 
     * This shouldn't be a partial update because we're only changing category_name, can't have duplicates
     * 
     * Data must include { category_name }
     * Returns "updated" { id, category_name } 
     * 
     * Throws BadRequestError if duplicates are found.
     * 
     * Throws NotFoundError if not found.
    */
    static async update(id, { category_name }){
        const duplicateCheck = await db.query(`
            SELECT category_name
            FROM categories
            WHERE category_name = $1
        `, [category_name]);

        if(duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate category name: ${ category_name }`);
    
        const querySql = `UPDATE categories
                          SET category_name = $2
                          WHERE id = $1
                          RETURNING id, category_name
        `;

        const result = await db.query(querySql, [id, category_name]);
        const category = result.rows[0];

        if(!category) throw new NotFoundError(`No category: ${id}`);

        return category;
    }

    /** Delete given category from database; returns undefined.
     * 
     * Throws NotFoundError if category not found.
     * 
    */
    static async remove(id){
        const result = await db.query(`
            DELETE
            FROM categories
            WHERE id = $1
            RETURNING id
            `, [id]);
        const category = result.rows[0];

        if(!category) throw new NotFoundError(`No category: ${id}`);
        return { id: id, message: "Category deleted successfully!"};
    }

}

module.exports = Category;
