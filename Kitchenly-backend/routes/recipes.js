"use strict";

// Routes for recipes.

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Recipe = require("../models/recipe");
const recipeNewSchema = require("../schemas/recipeNew.json");
const recipeUpdateSchema = require("../schemas/recipeUpdate.json");
const recipeSearchSchema = require("../schemas/recipeSearch.json");

const router = express.Router();

/** POST / { data: { username: req.params.username, title, recipe_description, ... } } 
 * Add recipe to db and to users submitted recipes
 * Returns submitted recipe.
*/

router.post("/:username", ensureLoggedIn, ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        // add username
        req.body.username = req.params.username;
        const validator = jsonschema.validate(req.body, recipeNewSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            console.debug(errs);
            throw new BadRequestError(errs);
        }

        const data = req.body;
        data.username = req.params.username;
        const new_recipe = await Recipe.create(data);
        return res.status(201).json({ recipe: new_recipe });
    } catch (err) {
        return next(err);
    }
});

/** GET / => { recipes: [ { username, title, recipe_description,  }, ...] } 
 * Returns list of recipes
 * 
 * Has the option to filter search by [ title ]
 * 
 * Authorization required: logged-in
*/

router.get("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, recipeSearchSchema);
        const data = req.query;
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            console.debug(errs);
            throw new BadRequestError(errs);
        }
        const recipes = await Recipe.findAll(data.title);
        return res.status(200).json({ recipes: recipes });
    } catch (err) {
        return next(err);
    }
});

/** GET /:recipe_id => { recipe: { username, title, recipe_description, ...} } 
 * 
 * Authorization required: logged-in
*/

router.get("/search/:recipe_id", ensureLoggedIn, async function (req, res, next) {
    try {
        const recipe = await Recipe.get(req.params.recipe_id);
        return res.status(200).json({ recipe: recipe });
    } catch (err) {
        return next(err);
    }
});

/** GET /category with { category_ids: [1, 2, ... ] }=> [ { username, title, recipe_description }, ... ] 
 * 
 * Authorization required: logged-in
*/

router.get("/filter/categories", ensureLoggedIn, async function (req, res, next) {
    try {
        const data = Object.keys(req.query).length > 0 ? req.query : req.body;
        const recipes = await Recipe.getRecipesByCategory(data.category_ids);
        return res.json({ recipes });
    } catch (err) {
        return next(err);
    }
});

/** GET /tags with { tag_ids: [1, 2, ...] } [ { username, title, recipe_description }, ... ] 
 * 
 * Authorization required: logged-in
*/

router.get("/filter/tags", ensureLoggedIn, async function (req, res, next) {
    try {
        const data = Object.keys(req.query).length > 0 ? req.query : req.body;
        const recipes = await Recipe.getRecipesByTags(data.tag_ids);
        return res.status(200).json({ recipes });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /:recipe_id 
 * @param data => { title, recipe_description, preparation_time, cooking_time, servings, ingredients, categories, tags } 
 * 
 * Make sure that either admin or user who created the recipe can edit.
**/
router.patch("/:username/:recipe_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, recipeUpdateSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const result = await Recipe.update(req.params.recipe_id, req.body);
        return res.status(201).json({ result });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /:username/:recipe_id */
router.delete("/:username/:recipe_id", async function (req, res, next) {
    try {
        const result = await Recipe.remove(req.params.recipe_id);
        return res.json({ result });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
