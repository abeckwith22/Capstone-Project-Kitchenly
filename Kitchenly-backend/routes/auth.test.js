"use strict";

const request = require("supertest");

const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /auth/token", () => {
    test("works", async () => {
        const res = await request(app)
            .post("/auth/token")
            .send({
                username: "u1",
                password: "password1",
            });
        expect(res.body).toEqual({
            "token": expect.any(String),
        });
    });

    test("unauth with non-existent user", async () => {
        const res = await request(app)
            .post("/auth/token")
            .send({
                username: "no-such-user",
                password: "password1",
        });
        expect(res.statusCode).toEqual(401);
    });

    test("unauth with wrong password", async () => {
        const res = await request(app)
       .post("/auth/token")
       .send({
            username: "u1",
            password: "nope"
        });
        expect(res.statusCode).toEqual(401);
    });

    test("bad request with missing data", async () => {
        const res = await request(app)
        .post("/auth/token")
        .send({
            username: "u1",
        });
        expect(res.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async () => {
        const res = await request(app)
        .post("/auth/token")
        .send({
            username: 42,
            password: "above-is-a-number"
        });
        expect(res.statusCode).toEqual(400);
    });
});

describe("POST /auth/register", () => {
    test("works for anon", async () => {
        const res = await request(app)
        .post("/auth/register")
        .send({
            username: "new",
            first_name: "first",
            last_name: "last",
            password: "password",
            email: "new@email.com",
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            "token": expect.any(String),
        });
    });

    test("bad request with missing fields", async () => {
        const res = await request(app)
        .post("/auth/register")
        .send({
            username: "new",
        });
        expect(res.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async () => {
        const res = await request(app)
        .post("/auth/register")
        .send({
            username: "new",
            first_name: "first",
            last_name: "last",
            password: "password",
            email: "not-an-email",
        });
        expect(res.statusCode).toEqual(400);
    });
});
