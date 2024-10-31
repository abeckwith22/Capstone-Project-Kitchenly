const Category = require("./category");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testCategoriesIds,
} = require("./_testCommon");

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Category.create", () => {
    test("creates a new category", async () => {
        const category = await Category.create({
            category_name: "category11",
        });
        expect(category).toEqual(
            expect.objectContaining({
                category_name: "category11",
            })
        );
    });
});

describe("Category.findAll", () => {
    test("retrieves all categories", async () => {
        const categories = await Category.findAll();
        expect(categories.length).toEqual(10);
        expect(categories).toEqual(expect.arrayContaining([
            expect.objectContaining({
                category_name: "category1",
            }),
            expect.objectContaining({
                category_name: "category2",
            }),
            expect.objectContaining({
                category_name: "category3",
            }),
        ]));
    });
    test("filters categories", async () => {
        const filteredCategories = await Category.findAll("3"); 
        expect(filteredCategories).toEqual([
            expect.objectContaining({
                category_name: "category3",
            }),
        ]);
    });
});

describe("Category.get", () => {
    test("retrieves a category by id", async () => {
        const category = await Category.get(testCategoriesIds[0]);
        expect(category).toEqual(expect.objectContaining({
            category_name: "category1",
        }));
    });
    test("throws NotFoundError if category id not found", async () => {
        try {
            await Category.get(16000000);
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

describe("Category.update", () => {
    test("updates a Categories data", async () => {
        const updatedCategory = await Category.update(testCategoriesIds[0], { category_name:"Updated" });
        expect(updatedCategory).toEqual(expect.objectContaining({
            category_name: "Updated"
        }));
    });
    test("throws NotFoundError if category id doesn't exist", async () => {
        try {
            await Category.update(16000000, { category_name: "Updated" });
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test("throws BadRequest error if duplicate category name", async () => {
        try {
            await Category.update(testCategoriesIds[0], { category_name: "category1" });
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

describe("Category.remove", () => {
    test("deletes an category", async () => {
        const response = await Category.remove(testCategoriesIds[0]);
        expect(response).toEqual({ 
            id: testCategoriesIds[0], 
            message: "Category deleted successfully!"
        });
    })
})
