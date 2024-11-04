"use strict";

// Routes for ingredients

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Ingredient = require("../models/ingredient");
const ingredientNewSchema = require("../schemas/ingredientNew.json");
const ingredientUpdateSchema = require("../schemas/ingredientUpdate.json")

const router = express.Router();

/** POST / { data: { [ingredient_name,...]} } 
 * Returns { ingredient: { ingredient_id, ingredient_name } } 
 * 
 * - data has to be an array of ingredient_names you want to add to the database.
 * Authorization required: admin
*/

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, ingredientNewSchema);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const ingredients = await Ingredient.create(req.body);
        return res.status(201).json({ ingredients: ingredients });
    } catch (err) {
        return next(err);
    }
});

/** GET / 
 * Returns list of all ingredients [ { id, ingredient_name }, ... ]
 * 
 * Authorization required: logged-in
*/

router.get("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const ingredients = await Ingredient.findAll();
        return res.status(200).json({ ingredients: ingredients });
    } catch (err) {
        return next(err);
    }
});

/** GET /:ingredient_id 
 * Returns { ingredient: ingredient }
 * Authorization required: logged-in
*/

router.get("/:ingredient_id", ensureLoggedIn, async function (req, res, next) {
    try {
        const ingredient = await Ingredient.get(req.params.ingredient_id);
        return res.status(200).json({ ingredient: ingredient });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /:ingredient_id { data: { ingredient_name } } 
 * Returns updated ingredient
 * 
 * Authorization required: admin
*/

router.patch("/:ingredient_id", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, ingredientUpdateSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const ingredient = await Ingredient.update(req.params.ingredient_id, req.body);
        return res.json({ ingredient: ingredient });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /:ingredient_id
 * Returns { ingredient_id: ingredient_id, message: "ingredient deleted successfully" }
 * Authorization required: admin
*/

router.delete("/:ingredient_id", ensureAdmin, async function (req, res, next) {
    try {
        await Ingredient.remove(req.params.ingredient_id);
        return res.json({ ingredient_id: req.params.ingredient_id, message: "Ingredient deleted successfully"});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
