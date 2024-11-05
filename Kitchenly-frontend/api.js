import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";


/** API Class.
 * 
 * Static class tying together methods used to get/send to the API.
 * There shouldn't be any frontend-specific stuff here, 
 * and there shouldn't be any API-aware stuff elsewhere in the frontend.
 * 
*/

class KitchenlyApi {
    // the token for interacting with the API will be stored here
    static token;

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call", endpoint, data, method);

        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${JoblyApi.token}` };
        const params = (method === "get")
            ? data
            : {};
        
        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    /** API methods */

    /** Sets kitchenly token to users token. 
     * Used to authenticate further requests.
    **/
    static setToken(token) {
        KitchenlyApi.token = token;
    }

    /** Gets token from kitchenly api */
    static getToken() {
        return KitchenlyApi.token;
    }

    /** Gets token from user with { username, password } */
    static async getToken(user) {
        let res = await this.request(`/auth/token`, user, "post");
        return res.token;
    }

    /** Registers user to database with { username, password, first_name, last_name, email } => { token } */
    static async registerUser(user) {
        let res = await this.request(`/auth/register`, user, "post");
        return res.token;
    }

    /** Get details on user in database by username 
     * 
     * - Authorization required: admin or same-user
    **/
    static async getUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    /** Update data on user
     * data => { first_name, last_name, password, email } => { user }
     * 
     * - Authorization required: admin or same-user
    **/
    static async patchUser(username, user) {
        let res = await this.request(`users/${username}`, user, "patch");
        return res.user;
    }

    /** Delete user
     * 
     * - Authorization required: admin or same-user
    **/
    static async deleteUser(username) {
        let res = await this.request(`users/${username}`, "delete");
        return res;
    }

}