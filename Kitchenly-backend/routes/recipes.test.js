"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Recipe = require("../models/recipe");

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

describe("POST /recipes/:username", () => {
    test("works with admin", async () => {
        const res = await request(app)
        .post(`/recipes/u1`)
        .send({
            username: "u1",
            title: "French Toast",
            recipe_description: "Et natus in nulla consequuntur sint.",
            ingredients: [ingredientIds[12], ingredientIds[6], ingredientIds[10]],
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({
            recipe: expect.objectContaining({
                username: "u1",
                title: "French Toast",
                recipe_description: "Et natus in nulla consequuntur sint.",
                ingredients: expect.arrayContaining([
                    expect.objectContaining({
                        id:ingredientIds[12]
                    }),
                    expect.objectContaining({
                        id:ingredientIds[6]
                    }),
                    expect.objectContaining({
                        id:ingredientIds[10]
                    }),
                ]),
            }),
        }));
    });
});

describe("GET /recipes", () => {
    test("works for logged in users", async () => {
        const res = await request(app)
        .get("/recipes")
        .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            recipes: expect.arrayContaining([
                expect.objectContaining({
                    title: "Cereal",
                }),
                expect.objectContaining({
                    title: "Tacos",
                }),
                expect.objectContaining({
                    title: "Grilled Cheese",
                }),
            ]),
        });
    });

    test("unauth for anon", async () => {
        const res = await request(app)
        .get("/recipes")
        expect(res.statusCode).toEqual(401);
    });
});

describe("GET /recipes/search/:recipe_id", () => {
    test("works with user", async () => {
        const res = await request(app)
        .get(`/recipes/search/${recipeIds[0]}`)
        .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            recipe: expect.objectContaining({
                username: "u1",
                recipe_description: expect.any(String),
            }),
        });
    });
});

describe("GET /recipes/filter/categories", () => {
    test("works for user", async () => {
        const res = await request(app)
        .get(`/recipes/filter/categories`)
        .send({
            category_ids: [categoryIds[0]],
        })
        .set("authorization", `Bearer ${u2Token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            recipes: expect.arrayContaining([
                expect.objectContaining({
                    username: "u1",
                    title: "Cereal",
                    recipe_description: "Milk and cereal of your choice into a bowl, mix and serve with a spoon!",
                    preparation_time: 5,
                    cooking_time: null,
                    servings: 1
                }),
            ]),
        });
    });
});

describe("GET /recipes/filter/tag", () => {
    test("works for user", async () => {
        const res = await request(app)
        .get(`/recipes/filter/tags`)
        .send({
            tag_ids: [tagIds[2]],
        })
        .set("authorization", `Bearer ${u2Token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            recipes: expect.arrayContaining([
                expect.objectContaining({
                    username: "u1",
                    title: "Tacos",
                    recipe_description: "Prepare, beef, romaine lettuce, guacamole, sour cream, and a cheese of your choice and place them on a tortilla shell. Finally, wrap it up and enjoy!",
                    preparation_time: 10,
                    cooking_time: 10,
                    servings: 1
                }),
            ]),
        });
    });
});

describe("PATCH /recipes/:username/:recipe_id", () => {
    test("works for admin", async () => {
        const res = await request(app)
        .patch(`/recipes/u1/${recipeIds[0]}`)
        .send({
            title: "Updated"
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({
            username: "u1",
            title: "Updated",
        }));
    });
    
    test("works for same user", async () => {
        const res = await request(app)
        .patch(`/recipes/u1/${recipeIds[0]}`)
        .send({
            title: "Updated"
        })
        .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({
            username: "u1",
            title: "Updated",
        }));
    });
});

describe("DELETE /recipes/:username/:recipe_id", () => {
    test("works for admin", async () => {
        const res = await request(app)
        .delete(`/recipes/u1/${recipeIds[0]}`)
        .set("Authorization", `Bearer ${adminToken}`)
        expect(res.body).toEqual(expect.objectContaining({
            username: "u1",
            title: "Cereal",
            message: "Recipe deleted successfully!",
        }));
    });

    test("works for same user", async () => {
        const res = await request(app)
        .delete(`/recipes/u1/${recipeIds[0]}`)
        .set("Authorization", `Bearer ${adminToken}`)
        expect(res.body).toEqual(expect.objectContaining({
            username: "u1",
            title: "Cereal",
            message: "Recipe deleted successfully!",
        }));
    })
})
