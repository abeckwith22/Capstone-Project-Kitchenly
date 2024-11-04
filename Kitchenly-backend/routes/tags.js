"use strict";

// Routes for tags

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Tag = require("../models/tag");
const tagNewSchema = require("../schemas/tagNew.json");
const tagUpdateSchema = require("../schemas/tagUpdate.json")

const router = express.Router();

/** POST / { data: { tag_name } }
 * Returns { tag: { tag_id, tag_name } } 
 * 
 * Authorization required: admin
*/

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, tagNewSchema);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const tag = await Tag.create(req.body);
        return res.status(201).json({ tag: tag });
    } catch (err) {
        return next(err);
    }
});

/** GET / 
 * Returns list of all tags [ { id, tag_name }, ... ]
 * 
 * Authorization required: logged-in
*/

router.get("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const tags = await Tag.findAll();
        return res.status(200).json({ tags: tags });
    } catch (err) {
        return next(err);
    }
});

/** GET /:tag_id
 * Returns { tag: tag }
 * Authorization required: logged-in
*/

router.get("/:tag_id", ensureLoggedIn, async function (req, res, next) {
    try {
        const tag = await Tag.get(req.params.tag_id);
        return res.status(200).json({ tag: tag});
    } catch (err) {
        return next(err);
    }
});

/** PATCH /:tag_id { data: { tag_id } } 
 * Returns updated tag 
 * 
 * Authorization required: admin
*/

router.patch("/:tag_id", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, tagUpdateSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const tag = await Tag.update(req.params.tag_id, req.body);
        return res.json({ tag: tag});
    } catch (err) {
        return next(err);
    }
});

/** DELETE /:tag_id
 * Returns { tag_id: tag_id, message: "Tag deleted successfully" }
 * Authorization required: admin
*/

router.delete("/:tag_id", ensureAdmin, async function (req, res, next) {
    try {
        await Tag.remove(req.params.tag_id);
        return res.json({ tag_id: req.params.tag_id, message: "Tag deleted successfully"});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
