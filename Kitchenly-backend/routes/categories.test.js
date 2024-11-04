"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Category = require("../models/category");

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

describe("POST /categories", () => {
    test("works for admin", async () => {
        const res = await request(app)
        .post(`/categories`)
        .send({
            category_name: "newCategory",
        })
        .set("Authorization", `Bearer ${adminToken}`)
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            category: expect.objectContaining({
                category_name: "newCategory",
            }),
        });
    });

    test("doesn't work for user", async () => {
        const res = await request(app)
        .post(`/categories`)
        .send({
            category_name: "newCategory",
        })
        .set("Authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(401);
    });
});

describe("GET /categories", () => {
    test("works for users", async () => {
        const res = await request(app)
        .get(`/categories`)
        .set("Authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            categories: expect.arrayContaining([
                expect.objectContaining({
                    category_name: "Breakfast",
                }),
                expect.objectContaining({
                    category_name: "Lunch",
                }),
                expect.objectContaining({
                    category_name: "Dinner",
                }),
            ]),
        });
    });
});

describe("GET /categories/:category_id", () => {
    test("works for users", async () => {
        const res = await request(app)
        .get(`/categories/${categoryIds[0]}`)
        .set("Authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            category: expect.objectContaining({
                category_name: "Breakfast",
            }),
        });
    });
    test("throws 404 if category_id not found", async () => {
        const res = await request(app)
        .get(`/categories/1600000`)
        .set("Authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404);
    })
});

describe("PATCH /categories/:category_id", () => {
    test("works for admin", async () => {
        const res = await request(app)
        .patch(`/categories/${categoryIds[0]}`)
        .send({
            category_name: "Updated",
        })
        .set("Authorization", `Bearer ${adminToken}`);
        expect(res.body).toEqual({
            category: expect.objectContaining({
                category_name: "Updated",
            }),
        });
    });
    test("doesn't work for user", async () => {
        const res = await request(app)
        .patch(`/categories/${categoryIds[0]}`)
        .send({
            category_name: "Updated",
        })
        .set("Authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(401);
    });
});

describe("DELETE /categories/:category_id", () => {
    test("works for admin", async () => {
        const res = await request(app)
        .delete(`/categories/${categoryIds[0]}`)
        .set("Authorization", `Bearer ${adminToken}`);
        expect(res.body).toEqual(expect.objectContaining({
            message: "Category deleted successfully"
        }));
    });

    test("doesn't work for user", async () => {
        const res = await request(app)
        .delete(`/categories/${categoryIds[0]}`)
        .set("Authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(401);
    });
});
