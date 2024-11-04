"use strict";

// Routes for categories

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Category = require("../models/category");
const categoryNewSchema = require("../schemas/categoryNew.json");
const categoryUpdateSchema = require("../schemas/categoryUpdate.json")

const router = express.Router();

/** POST / { data: { category_name } } 
 * Returns { category: { category_id, category_name } } 
 * 
 * Authorization required: admin
*/

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, categoryNewSchema);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const category = await Category.create(req.body);
        return res.status(201).json({ category: category });
    } catch (err) {
        return next(err);
    }
});

/** GET / 
 * Returns list of all categories [ { id, categories }, ... ]
 * 
 * Authorization required: logged-in
*/

router.get("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const categories = await Category.findAll();
        return res.status(200).json({ categories: categories });
    } catch (err) {
        return next(err);
    }
});

/** GET /:category_id
 * Returns { category: category }
 * Authorization required: logged-in
*/

router.get("/:category_id", ensureLoggedIn, async function (req, res, next) {
    try {
        const category = await Category.get(req.params.category_id);
        return res.status(200).json({ category: category});
    } catch (err) {
        return next(err);
    }
});

/** PATCH /:category_id { data: { category_name } } 
 * Returns updated category
 * 
 * Authorization required: admin
*/

router.patch("/:category_id", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, categoryUpdateSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const category = await Category.update(req.params.category_id, req.body);
        return res.json({ category: category});
    } catch (err) {
        return next(err);
    }
});

/** DELETE /:category_id
 * Returns { category_id: category_id, message: "category deleted successfully" }
 * Authorization required: admin
*/

router.delete("/:category_id", ensureAdmin, async function (req, res, next) {
    try {
        await Category.remove(req.params.category_id);
        return res.json({ category_id: req.params.category_id, message: "Category deleted successfully"});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
