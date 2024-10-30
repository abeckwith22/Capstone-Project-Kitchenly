const Recipe = require("./recipe");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testRecipeIds,
} = require("./_testCommon");

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Recipe.create", () => {
    test("creates a new recipe", async () => {
        const recipe = await Recipe.create({
            username: "user1",
            title: "Recipe4",
            recipe_description: "Delightful treat",
            preparation_time: 5,
            cooking_time: 5,
            servings: 1,
        });
        expect(recipe).toEqual(
            expect.objectContaining({
                username: "user1",
                title: "Recipe4",
                recipe_description: "Delightful treat",
                preparation_time: 5,
                cooking_time: 5,
                servings: 1,
            })
        );
    });

    test("allows for submitted null values for recipe_description, preparation_time, cooking_time, and servings", async () => {
        const recipe = await Recipe.create({
            username: "user1",
            title: "Recipe4",
        });
        expect(recipe).toEqual(
            expect.objectContaining({
                username: "user1",
                title: "Recipe4",
                recipe_description: null,
                preparation_time: null,
                cooking_time: null,
                servings: null
            })
        );
    });
    test("disallows null values for username/title", async () => {
        try{
            await Recipe.create({});
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

describe("Recipe.findAll", () => {
    test("retrieves all recipes", async () => {
        const recipes = await Recipe.findAll();
        expect(recipes.length).toBeGreaterThanOrEqual(3);
        expect(recipes instanceof Object);
        expect(recipes).toEqual(expect.arrayContaining([
            expect.objectContaining({
                username: "user1",
                title: "Recipe1",
                recipe_description: "Delicious dish 1",
                preparation_time: 10,
                cooking_time: 20,
                servings: 2,
            }),
            expect.objectContaining({
                username: "user2",
                title: "Recipe2",
                recipe_description: "Tasty meal 2",
                preparation_time: 15,
                cooking_time: 30,
                servings: 4,
            }),
            expect.objectContaining({
                username: "user1",
                title: "Recipe3",
                recipe_description: "Amazing dish 3",
                preparation_time: 5,
                cooking_time: 15,
                servings: 1,
            }),
        ]));
    });
});

describe("Recipe.get", () => {
    test("retrieves a recipe by title", async () => {
        const recipe = await Recipe.get(testRecipeIds[2]);
        expect(recipe).toEqual(expect.objectContaining({
            username: "user1",
            title: "Recipe3",
            recipe_description: "Amazing dish 3",
            preparation_time: 5,
            cooking_time: 15,
            servings: 1,
        }));
    });
    test("throws NotFoundError if recipe not found", async () => {
        try{
            await Recipe.get(16000000); // I believe the max range for INT ids is somewhere around 16,000,000
        }catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

describe("Recipe.update", () => {
    test("updates a recipe's data", async () => {
        const updatedRecipe = await Recipe.update(testRecipeIds[2], { title: "Updated" });
        expect(updatedRecipe).toEqual(expect.objectContaining({
            username: "user1",
            title: "Updated",
            recipe_description: "Amazing dish 3",
            preparation_time: 5,
            cooking_time: 15,
            servings: 1,
        }));
    });
    test("throws BadRequestError if user tries to update username/id", async () => {
        try {
            await Recipe.update(testRecipeIds[2], { id: 3, username: "user2" });
        }catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
    test("throws NotFoundError if recipe id doesn't exist", async () => {
        try{
            await Recipe.update(16000000, { title: "Updated" });
        }catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

describe("Recipe.remove", () => {
    test("deletes a recipe", async () => {
        const response = await Recipe.remove(testRecipeIds[0]);
        expect(response).toEqual(
            {
                id: testRecipeIds[0],
                username: "user1",
                title: "Recipe1",
                message: "Recipe deleted successfully!"
            }
        );
    });
    test("throws NotFoundError if recipe id doesn't exist", async () => {
        try{
            await Recipe.remove(16000000);
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
})
