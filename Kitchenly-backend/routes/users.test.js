"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
    adminToken,
    recipeIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /users", () => {
    test("works for admins: create non-admin", async () => {
        const res = await request(app)
        .post("/users")
        .send({
            username: "new-user",
            first_name: "firstNew",
            last_name: "lastNew",
            email: "new@email.com",
            password: "password-new",
            is_admin: false,
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            user: {
                username: "new-user",
                first_name: "firstNew",
                last_name: "lastNew",
                email: "new@email.com",
                is_admin: false,
            }, token: expect.any(String),
        });
    });

    test("works for admins: create admin", async () => {
        const res = await request(app)
        .post("/users")
        .send({
            username: "new-user",
            first_name: "firstNew",
            last_name: "lastNew",
            email: "new@email.com",
            password: "password-new",
            is_admin: true,
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            user: {
                username: "new-user",
                first_name: "firstNew",
                last_name: "lastNew",
                email: "new@email.com",
                is_admin: true,
            }, token: expect.any(String),
        });
    });
});

describe("GET /users", () => {
    test("works for admins", async () => {
        const res = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${adminToken}`);

        expect(res.body).toEqual(expect.objectContaining({
            users: expect.arrayContaining([
                expect.objectContaining({
                    username: "u1",
                    first_name: "U1F",
                    last_name: "U1L",
                    email: "user1@user.com",
                    is_admin: false
                }),
                expect.objectContaining({
                    username: "u2",
                    first_name: "U2F",
                    last_name: "U2L",
                    email: "user2@user.com",
                    is_admin: false
                }),
                expect.objectContaining({
                    username: "u3",
                    first_name: "U3F",
                    last_name: "U3L",
                    email: "user3@email.com",
                    is_admin: false
                }),
        ])}));
    });

    test("unauth for non-admin users", async () => {
        const res = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(401);
    });

    test("unauth for anon", async () => {
        const res = await request(app)
        .get("/users")
        expect(res.statusCode).toEqual(401);
    });

    test("fails: tests next() handler", async () => {
        await db.query("DROP TABLE users CASCADE");
        const res = await request(app)
            .get("/users")
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(500);
    });
});

describe("GET /users/:username", () => {
    test("works for admin", async () => {
        const res = await request(app)
        .get(`/users/u1`)
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.body).toEqual({
            user: expect.objectContaining({
                username: "u1",
                first_name: "U1F",
                last_name: "U1L",
                email: "user1@user.com",
                is_admin: false,
            }),
        });
    });
    
    test("works for same user", async () => {
        const res = await request(app)
        .get(`/users/u1`)
        .set("authorization", `Bearer ${u1Token}`);
        expect(res.body).toEqual({
            user: expect.objectContaining({
                username: "u1",
                first_name: "U1F",
                last_name: "U1L",
                email: "user1@user.com",
                is_admin: false,
            }),
        });
    });

    test("unauth for other users", async () => {
        const res = await request(app)
        .get(`/users/u1`)
        .set("authorization", `Bearer ${u2Token}`);
        expect(res.statusCode).toEqual(401);
    });

    test("unauth for anon", async () => {
        const res = await request(app)
        .get(`/users/u1`)
        expect(res.statusCode).toEqual(401);
    });

    test("not found if user not found", async () => {
        const res = await request(app)
        .get("/users/nope")
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404);
    });
});

describe("PATCH /users/:username", () => {
    test("works for admins", async () => {
        const res = await request(app)
        .patch("/users/u1")
        .send({
            first_name: "Updated"
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.body).toEqual({
            user: expect.objectContaining({
                username: "u1",
                first_name: "Updated",
                last_name: "U1L",
                email: "user1@user.com",
                is_admin: false
            }),
        });
    });

    test("works for same user", async () => {
        const res = await request(app)
        .patch(`/users/u1`)
        .send({
            first_name: "Updated",
        })
        .set("authorization", `Bearer ${u1Token}`);
        expect(res.body).toEqual({
            user: expect.objectContaining({
                username: "u1",
                first_name: "Updated",
                last_name: "U1L",
                email: "user1@user.com",
                is_admin: false,
            }),
        });
    });

    test("unauth if not same user", async () => {
        const res = await request(app)
        .patch(`/users/u1`)
        .send({
            first_name: "Updated"
        })
        .set("authorization", `Bearer ${u2Token}`);
        expect(res.statusCode).toEqual(401);
    });

    test("not found if no such user exists", async () => {
        const res = await request(app)
        .patch(`/users/nope`)
        .send({
            first_name: "Updated"
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404);
    });

    test("bad request if invalid data", async () => {
        const res = await request(app)
        .patch(`/users/u1`)
        .send({
            first_name: 400
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(400);
    });

    test("works: can set new password", async () => {
        const res = await request(app)
        .patch(`/users/u1`)
        .send({
            password: "new-password"
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.body).toEqual({
            user: expect.objectContaining({
                username: "u1",
                first_name: "U1F",
                last_name: "U1L",
                email: "user1@user.com",
                is_admin: false,
            }),
        })
        const success = await User.authenticate("u1", "new-password");
        expect(success).toBeTruthy();
    });
});

describe("DELETE /users/:username", () => {
    test("works for admin", async () => {
        const res = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.body).toEqual({ deleted: "u1" });
    });

    test("works for same user", async () => {
        const res = await request(app)
        .delete(`/users/u1`)
        .set( "authorization", `Bearer ${u1Token}` );
        expect(res.body).toEqual({ deleted: "u1" });
    });

    test("unauth if not same user", async () => {
        const res = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${u2Token}`);
        expect(res.statusCode).toEqual(401);
    });

    test("unauth if anon", async () => {
        const res = await request(app)
        .delete(`/users/u1`)
        expect(res.statusCode).toEqual(401);
    });

    test("not found if user missing", async () => {
        const res = await request(app)
        .delete(`/users/nope`)
        .set("authorization", `Bearer ${adminToken}`)
        expect(res.statusCode).toEqual(404);
    });
});

describe("POST /users/:username/recipe/:recipe_id", () => {
    test("works with admin", async () => {
        const res = await request(app)
        .post(`/users/u1/recipe/${recipeIds[0]}`)
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.body).toEqual({
            username: "u1",
            recipe_id: recipeIds[0],
            message: "Recipe saved successfully",
        });
    });

    test("works with same user", async () => {
        const res = await request(app)
        .post(`/users/u1/recipe/${recipeIds[0]}`)
        .set("authorization", `Bearer ${u1Token}`);
        expect(res.body).toEqual({
            username: "u1",
            recipe_id: recipeIds[0],
            message: "Recipe saved successfully",
        });
    });

    test("not found if username missing", async () => {
        const res = await request(app)
        .post(`/users/nope/recipe/${recipeIds[0]}`)
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404);
    });

    test("not found if recipe_id missing", async () => {
        const res = await request(app)
        .post(`/users/u1/recipe/1600000`)
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404);
    });
});
