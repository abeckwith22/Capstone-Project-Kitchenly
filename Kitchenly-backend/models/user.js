"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config"); // config.js (maybe...)

// Related functions for users.

class User {
    /** authenticate user with username, password
     * 
     *  Returns { username, first_name, last_name, email, is_admin }
     * 
     *  Throws UnauthorizedError if user not found or wrong password
     */

    static async authenticate(username, password) {
        // try to find user first
        const result = await db.query(
            `SELECT username,
                    password,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    is_admin AS "isAdmin"
             FROM users
             WHERE username = $1`,
             [username],
        );

        const user = result.rows[0];

        if(user) {
            const isValid = await bcrypt.compare(password, user.password);
            if(isValid){
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }

    /** Register user with data.
     * 
     * Returns { username, firstName, lastName, email, isAdmin }
     * 
     * Throws BadRequestError on duplicates
    */
    static async register({ username, password, firstName, lastName, email, isAdmin }) {
        const duplicateCheck = await db.query(
            `SELECT username
             FROM users
             WHERE username = $1`,
            [username],
        );

        if(duplicateCheck.rows[0]){
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
                (username,
                 password,
                 first_name,
                 last_name,
                 email,
                 is_admin)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
            [
                username,
                hashedPassword,
                firstName,
                lastName,
                email,
                isAdmin,
            ],
        );

        const user = result.rows[0];

        return user;
    }


    /** Find all users.
     * 
     * Returns [{ username, first_name, last_name, email, is_admin }, ...]
    */

    static async findAll() {
        const result = await db.query(
            `SELECT username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    is_admin AS "isAdmin"
             FROM users
             ORDER BY username`,
        );

        return result.rows;
    }

    /** Given a username, return data about user.
     * 
     * Returns { username, first_name, last_name, is_admin, recipes }
     *  where recipes is [{ id, username, title, recipe_description, preparation_time, cooking_time, servings, created_at }, ...]
     * 
     * Throws NotFoundError if user not found.
     */

    static async get(username) {
        // get user response from db
        const userRes = await db.query(
            `SELECT username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    is_admin AS "isAdmin"
             FROM users
             WHERE username = $1`,
            [username],
        );

        const user = userRes.rows[0];

        if(!user) throw new NotFoundError(`No user: ${username}`);

        const userRecipeRes = await db.query( // [?] TODO: might need to fix this depending on what userRecipeRes actually returns
            `SELECT r.id
             FROM recipes AS r
             WHERE r.username = $1`, [username]
        );
        
        user.recipes = userRecipeRes.rows.map(a => a.recipe_id);
        return user;
    }


    /** Update user data with `data` 
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     * 
     * Data can include: 
     *  { first_name, lastName, password, email, isAdmin }
     * 
     * Returns { username, firstName, lastName, email, isAdmin }
     * 
     * Throws NotFoundError if not found.
     * 
     * WARNING: this function can set a new password or make a suer an admin.
     * Calls to this function must be certain they have validated inputs to this
     * or serious security risks are opened.
    */

    static async update(username, data){
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                firstName: "first_name",
                lastName: "last_name",
                isAdmin: "is_admin",
            }
        );
        const usernameVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users
                          SET ${setCols}
                          WHERE username = ${usernameVarIdx}
                          RETURNING username,
                                    first_name AS "firstName",
                                    last_name AS "lastName",
                                    email,
                                    is_admin AS "isAdmin"`;

        const result = await db.query(querySql, [...values, username]);
        const user = result.rows[0];

        if(!user) throw new NotFoundError(`No user: ${username}`);

        delete user.password;
        return user;
    }

    /** Delete given user from data; returns undefined.  */
    static async remove(username) {
        const result = await db.query(
            `DELETE
             FROM users
             WHERE username = $1
             RETURNING username`,
             [username],
        );
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        return { user, message:"user deleted successfully!"};
    }

    /** Save a recipe: update db, returns undefined
     * 
     *  - username: username saving the recipe
     *  - recipeId: recipe id
     */
    static async saveRecipe(username, recipeId){

        // Avoiding nested queries fix
        const checkExists = await db.query(`
            SELECT u.username, r.id
            FROM users AS u
            JOIN recipes AS r ON r.id = $1
            WHERE u.username = $2`
        , [recipeId, username]);

        if(checkExists.rows.length === 0) throw new NotFoundError(`Recipe or User not found: Recipe ID: ${recipeId}, Username: ${username}`);

        // if user attempts to save recipe twice do nothing.
        await db.query(
            `INSERT INTO recipes_users (recipe_id, username)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
             [recipeId, username]
        );

        return { username, recipeId, message:"Recipe saved successfully" };
    }
}

module.exports = User;
