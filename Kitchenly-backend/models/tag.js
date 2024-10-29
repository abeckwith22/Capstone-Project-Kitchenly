"use strict"

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");

// Related functions for tags.

class Tag {
    /** Create a tag (from data), update db, return new tag data. 
     * data should be { tag_name }
     * returns { id, tag_name }
    */
    static async create(data) {
        const result = await db.query(
            `INSERT INTO tags (tag_name)
            VALUES ($1)
            RETURNING id, tag_name AS "tagName"`, [data.tag_name]
        );
        let tag = result.rows[0];

        return tag;
    }

    /** Find all tags (optional filter on searchFilters) 
     * searchFilters (all optional)
     * - name
     * 
     * returns [{id, tag_name}, ...]
    */
    static async findAll({ tag_name } = {}) { // [ ] FIX: Set this findAll function for references recipes with tag_name
        let query = `SELECT id
                            tag_name
                     FROM tags;
        `;
        let whereExpressions = [];
        let queryValues = [];

        // For each possible search term, add to whereExpresions and
        // queryValues so we can generate the right SQL

        if(tag_name !== undefined){
            queryValues.push(`%${tag_name}`);
            whereExpressions.push(`tag_name ILIKE $${queryValues.length}`);
        }
        if(whereExpressions.length > 0){
            query += " WHERE " + whereExpressions.join(" AND ");
        }

        // Finalize query and return results

        query += " ORDER BY tag_name"
        const tagsRes = await db.query(query, queryValues);
        return tagsRes.rows;
    }

    /** Given a tag id, return data about tag.
     * Returns { id, tag_name }
     * TODO: Add a recipe list that Returns { id, tag_name, recipes }
     *      where recipes are [{id, username, title, recipe_description, preparation_time, cooking_time, servings, created_at }, ...]
     * 
     * Throws NotFoundError if not found.
     */
    static async get(id) {
        const tagRes = await db.query(`
            SELECT id,
                   tag_name AS "tagName"
            FROM tags
            WHERE id = $1
        `, [id]);

        const tag = tagRes.rows[0];

        if(!tag) throw new NotFoundError(`No tag: ${id}`);

        return tag;
    }

    /** Update tag data with tag_id and `data` 
     * This shouldn't be a partial update because we're only changing tag_name, can't have duplicates
     * Data must include { tag_name }
     * Returns "updated" { tag_name } 
     * 
     * Throws NotFoundError if not found.
    */
    static async update(id, { tagName }){
        const duplicateCheck = await db.query(`
            SELECT tag_name
            FROM users
            WHERE username = $1
        `, [tagName]);

        if(duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate tag_name: ${ tagName }`);
    
        const querySql = `UPDATE tags
                          SET tag_name = $2
                          WHERE id = $1
        `;

        const result = await db.query(querySql, [id, tagName]);
        const tag = result.rows[0];

        if(!tag) throw new NotFoundError(`No tag: ${id}`);

        return tag;
    }

    /** Delete given tag from database; returns undefined.
     * 
     * Throws NotFoundError if tag not found.
     * 
    */
    static async remove(id){
        const result = await db.query(`
            DELETE
            FROM tags
            WHERE id = $1
            RETURNING id
            `, [id]);
        const tag = result.rows[0];

        if(!tag) throw new NotFoundError(`No tag: ${id}`);
    }
}

module.exports = Tag;
