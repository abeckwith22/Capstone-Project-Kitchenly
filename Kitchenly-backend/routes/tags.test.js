"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Tag = require("../models/tag");

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

describe("POST /tags", () => {
    test("works for admin", async () => {
        const res = await request(app)
        .post('/tags')
        .send({
            tag_name: "newTag",
        })
        .set("Authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            tag: expect.objectContaining({
                tag_name: "newTag"
            }),
        });
    });

    test("works for user", async () => {
        const res = await request(app)
        .post('/tags')
        .send({
            tag_name: "newTag",
        })
        .set("Authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            tag: expect.objectContaining({
                tag_name: "newTag",
            }),
        });
    });
});

describe("GET /tags", () => {
    test("works for users", async () => {
        const res = await request(app)
        .get('/tags')
        .set("Authorization", `Bearer ${u1Token}`);
        expect(res.body).toEqual({
            tags: expect.arrayContaining([
                expect.objectContaining({
                    tag_name: "challenging",
                }),
                expect.objectContaining({
                    tag_name: "easy-to-make",
                }),
                expect.objectContaining({
                    tag_name: "kid-friendly",
                }),
                expect.objectContaining({
                    tag_name: "quick",
                }),
            ]),
        });
    });
});

describe("GET /tags/:tag_id", () => {
    test("works for admin", async () => {
        const res = await request(app)
        .get(`/tags/${tagIds[0]}`)
        .set("Authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            tag: expect.objectContaining({
                tag_name: "cool",
            }),
        });
    });
    test("works for users", async () => {
        const res = await request(app)
        .get(`/tags/${tagIds[0]}`)
        .set("Authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            tag: expect.objectContaining({
                tag_name: "cool",
            }),
        });
    });
});

describe("PATCH /tags/:tag_id", () => {
    test("works for admin", async () => {
        const res = await request(app)
        .patch(`/tags/${tagIds[0]}`)
        .send({
            tag_name: "Updated",
        })
        .set("Authorization", `Bearer ${adminToken}`);
    });

    test("doesn't work for user", async () => {
        const res = await request(app)
        .patch(`/tags/${tagIds[0]}`)
        .send({
            tag_name: "Updated",
        })
        .set("Authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(401);
    });
});

describe("DELETE /tags/:tag_id", () => {
    test("works for admin", async () => {
        const res = await request(app)
        .delete(`/tags/${tagIds[0]}`)
        .set("Authorization", `Bearer ${adminToken}`);
        expect(res.body).toEqual(expect.objectContaining({
            message: "Tag deleted successfully",
        }));
    });

    test("doesn't work for user", async () => {
        const res = await request(app)
        .delete(`/tags/${tagIds[0]}`)
        .set("Authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(401);
    });
});
