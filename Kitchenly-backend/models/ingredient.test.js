const Ingredient = require("./ingredient");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testIngredientIds,
} = require("./_testCommon");

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Ingredient.create", () => {
    test("creates 3 new ingredients", async () => {
        const ingredients_arr = [
            "pesto",
            "apple",
            "milk",
        ];
        const ingredients = await Ingredient.create({
            ingredient_names: ingredients_arr
        });
        expect(ingredients).toEqual(expect.arrayContaining([
            expect.objectContaining({
                ingredient_name: "pesto"
            }),
            expect.objectContaining({
                ingredient_name: "apple"
            }),
            expect.objectContaining({
                ingredient_name: "milk"
            }),
        ]));
    });
});

describe("Ingredient.findAll", () => {
    test("retrieves all ingredients", async () => {
        const ingredients = await Ingredient.findAll();
        expect(ingredients).toEqual(expect.arrayContaining([
            expect.objectContaining({
                ingredient_name: "ingredient1",
            }),
            expect.objectContaining({
                ingredient_name: "ingredient2",
            }),
            expect.objectContaining({
                ingredient_name: "ingredient3",
            }),
        ]));
    });
    test("filters ingredients", async () => {
        const filteredIngredients = await Ingredient.findAll("3"); 
        expect(filteredIngredients).toEqual([
            expect.objectContaining({
                ingredient_name: "ingredient3"
            }),
        ]);
    });
});

describe("Ingredient.get", () => {
    test("retrieves a ingredient by id", async () => {
        const ingredient = await Ingredient.get(testIngredientIds[0]);
        expect(ingredient).toEqual(expect.objectContaining({
            ingredient_name: "ingredient1",
        }));
    });
    test("throws NotFoundError if ingredient id not found", async () => {
        try {
            await Ingredient.get(16000000);
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

describe("Ingredient.update", () => {
    test("updates a ingredient's data", async () => {
        const updatedIngredient = await Ingredient.update(testIngredientIds[0], { ingredient_name:"Updated" });
        expect(updatedIngredient).toEqual(expect.objectContaining({
            ingredient_name: "Updated"
        }));
    });
    test("throws NotFoundError if ingredient id doesn't exist", async () => {
        try {
            await Ingredient.update(16000000, { title: "Updated" });
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test("throws BadRequest error if duplicate ingredient name", async () => {
        try {
            await Ingredient.update(testIngredientIds[0], { ingredient_name: "ingredient1" });
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

describe("Ingredient.remove", () => {
    test("deletes an ingredient", async () => {
        const response = await Ingredient.remove(testIngredientIds[0]);
        expect(response).toEqual({ 
            id: testIngredientIds[0], 
            message: "Ingredient deleted successfully!"
        });
    })
})
