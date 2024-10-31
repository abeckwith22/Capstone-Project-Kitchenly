const Tag = require("./tag");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testTagIds,
} = require("./_testCommon");

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Tag.create", () => {
    test("creates a new tag", async () => {
        const tag = await Tag.create({
            tag_name: "tag4",
        });
        expect(tag).toEqual(
            expect.objectContaining({
                tag_name: "tag4",
            })
        );
    });
});

describe("Tag.findAll", () => {
    test("retrieves all tags", async () => {
        const tags = await Tag.findAll();
        expect(tags.length).toEqual(10);
        expect(tags).toEqual(expect.arrayContaining([
            expect.objectContaining({
                tag_name: "tag1",
            }),
            expect.objectContaining({
                tag_name: "tag2",
            }),
            expect.objectContaining({
                tag_name: "tag3",
            }),
        ]));
    });
    test("filters tags", async () => {
        const filteredTags = await Tag.findAll("3"); 
        expect(filteredTags).toEqual([
            expect.objectContaining({
                tag_name: "tag3",
            }),
        ]);
    });
});

describe("Tag.get", () => {
    test("retrieves a Tag by id", async () => {
        const tag = await Tag.get(testTagIds[0]);
        expect(tag).toEqual(expect.objectContaining({
            tag_name: "tag1",
        }));
    });
    test("throws NotFoundError if Tag id not found", async () => {
        try {
            await Tag.get(16000000);
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

describe("Tag.update", () => {
    test("updates a tag's data", async () => {
        const updatedTag = await Tag.update(testTagIds[0], { tag_name:"Updated" });
        expect(updatedTag).toEqual(expect.objectContaining({
            tag_name: "Updated"
        }));
    });
    test("throws NotFoundError if tag id doesn't exist", async () => {
        try {
            await Tag.update(16000000, { tag_name: "Updated" });
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test("throws BadRequest error if duplicate tag name", async () => {
        try {
            await Tag.update(testTagIds[1], { tag_name: "Updated" });
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

describe("Tag.remove", () => {
    test("deletes an tag", async () => {
        const response = await Tag.remove(testTagIds[0]);
        expect(response).toEqual({ 
            id: testTagIds[0], 
            message: "Tag deleted successfully!"
        });
    })
})
