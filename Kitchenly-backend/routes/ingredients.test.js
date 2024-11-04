"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Ingredient = require("../models/ingredient");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
    adminToken,
    ingredientIds,
    categoryIds,
    tagIds,
    userIds,
    recipeIds,
    
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /ingredients", () => {
    test("works for admin", async () => {
        const res = await request(app)
        .post(`/ingredients`)
        .send({
            ingredient_names: ["newIngredient"],
        })
        .set("Authorization", `Bearer ${adminToken}`);
        expect(res.body).toEqual({
            ingredients: expect.arrayContaining([
                expect.objectContaining({
                    ingredient_name: "newIngredient",
                }),
            ]),
        });
    });

    test("works for user", async () => {
        const res = await request(app)
        .post(`/ingredients`)
        .send({
            ingredient_names: ["newIngredient"],
        })
        .set("Authorization", `Bearer ${u1Token}`);
        expect(res.body).toEqual({
            ingredients: expect.arrayContaining([
                expect.objectContaining({
                    ingredient_name: "newIngredient",
                }),
            ]),
        });
    });
});

describe("GET /ingredients", () => {
    test("works for users", async () => {
        const res = await request(app)
        .get(`/ingredients`)
        .set("Authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({
            ingredients: expect.arrayContaining([
                expect.objectContaining({
                    ingredient_name: expect.any(String),
                }),
                expect.objectContaining({
                    ingredient_name: expect.any(String),
                }),
                expect.objectContaining({
                    ingredient_name: expect.any(String),
                }),
            ]),
        }));
    });
});

describe("GET /ingredients/:ingredient_id", () => {
    test("works for users", async () => {
        const res = await request(app)
        .get(`/ingredients/${ingredientIds[0]}`)
        .set("Authorization", `Bearer ${u1Token}`)
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            ingredient: expect.objectContaining({
                ingredient_name: "Tortilla",
            }),
        });
    });
    test("throws not found if ingredient_id doesn't exist", async () => {
        const res = await request(app)
        .get(`/ingredients/16000000`)
        .set("Authorization", `Bearer ${adminToken}`)
        expect(res.statusCode).toEqual(404);
    });
});

describe("PATCH /ingredients/:ingredient_id", () => {
    test("works for admin", async () => {
        const res = await request(app)
        .patch(`/ingredients/${ingredientIds[0]}`)
        .send({
            ingredient_name: "Updated"
        })
        .set("Authorization", `Bearer ${adminToken}`)
        expect(res.body).toEqual({
            ingredient: expect.objectContaining({
                ingredient_name: "Updated"
            }),
        });
    });

    test("doesn't work for user", async () => {
        const res = await request(app)
        .patch(`/ingredients/${ingredientIds[0]}`)
        .send({
            ingredient_name: "Updated"
        })
        .set("Authorization", `Bearer ${u1Token}`)
        expect(res.statusCode).toEqual(401);
    });
});

describe("DELETE /ingredients/:ingredient_id", () => {
    test("works for admin", async () => {
        const res = await request(app)
        .delete(`/ingredients/${ingredientIds[0]}`)
        .set("Authorization", `Bearer ${adminToken}`)
        expect(res.body).toEqual(expect.objectContaining({
            message: "Ingredient deleted successfully",
        }));
    });

    test("doesn't work for user", async () => {
        const res = await request(app)
        .delete(`/ingredients/${ingredientIds[0]}`)
        .set("Authorization", `Bearer ${u1Token}`)
        expect(res.statusCode).toEqual(401);
    });
});
