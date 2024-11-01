const Recipe = require("./recipe");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testRecipeIds,
    testCategoriesIds,
    testTagIds,
    testIngredientIds,
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
    test("retrieves ingredients array from recipe", async () => {
        const recipe = await Recipe.get(testRecipeIds[1]);
        expect(recipe).toEqual(expect.objectContaining({
            ingredients: expect.arrayContaining([
                expect.objectContaining({
                    ingredient_name: "ingredient1"
                }),
                expect.objectContaining({
                    ingredient_name: "ingredient2"
                }),
            ]),
        }));
    });
    test("retrieves categories array from recipe", async () => {
        const recipe = await Recipe.get(testRecipeIds[1]);
        expect(recipe).toEqual(expect.objectContaining({
            categories: expect.arrayContaining([
                expect.objectContaining({
                    category_name: "category1",
                }),
            ]),
        }));
    });
    test("retrieves tags array from recipe", async () => {
        const recipe = await Recipe.get(testRecipeIds[1]);
        expect(recipe).toEqual(expect.objectContaining({
            tags: expect.arrayContaining([
                expect.objectContaining({
                    tag_name: "tag1"
                }),
            ]),
        }));
    });
});

describe("Recipe.getRecipesByCategory", () => {
    test("retrieve recipe by category id", async () => {
        const recipe = await Recipe.getRecipesByCategory([testCategoriesIds[0]]);
        expect(recipe).toEqual(expect.arrayContaining([
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
        ]));
    });
    test("retrieve recipes by an array of category ids", async () => {
        const c_ids = [testCategoriesIds[0], testCategoriesIds[1]];
        const recipe = await Recipe.getRecipesByCategory(c_ids);
        expect(recipe).toEqual(expect.arrayContaining([
            expect.objectContaining({
                username: "user1",
                title: "Recipe1",
                recipe_description: "Delicious dish 1",
                cooking_time: 20,
            }),
        ]));
    });
});

describe("Recipe.getRecipesByTags", () => {
    test("retrieve recipe by tag name", async () => {
        const recipe = await Recipe.getRecipesByTags([testTagIds[0]]);
        expect(recipe).toEqual(expect.arrayContaining([
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
        ]));
    });
    test("retrieve recipes by an array of tags", async () => {
        const recipe = await Recipe.getRecipesByTags([testTagIds[0], testTagIds[1]]);
        expect(recipe).toEqual(expect.arrayContaining([
            expect.objectContaining({
                username: "user1",
                title: "Recipe1",
                preparation_time: 10,
                recipe_description: "Delicious dish 1"
            }),
        ]));
    });
});


describe("Recipe.setRecipeToCategory", () => {
    test("creates a singular recipes-to-categories relationship", async () => {
        const rcRelation = await Recipe.setRecipeToCategory(testRecipeIds[0], [testCategoriesIds[3]]);
        expect(rcRelation).toEqual(expect.objectContaining({
            message: "recipes-to-categories relationships created successfully"
        }));
    });
    test("creates multiple recipes-to-categories relationships", async () => {
        const rcRelations = await Recipe.setRecipeToCategory(testRecipeIds[0], [testCategoriesIds[3], testCategoriesIds[4]]);
        expect(rcRelations).toEqual(expect.objectContaining({
            message: "recipes-to-categories relationships created successfully"
        }));
    });
    test("throws BadRequestError if recipe_id/category_ids not found", async () => {
        try {
            await Recipe.setRecipeToCategory();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

describe("Recipe.setTagsToRecipes", () => {
    test("creates single tag-to-recipe relationship", async () => {
        const trRelation = await Recipe.setTagsToRecipe([testTagIds[4]], testRecipeIds[0]);
        expect(trRelation).toEqual(expect.objectContaining({
            message: "tags-to-recipes relationships created successfully"
        }));
    });
    test("creates multiple tags-to-recipes relationships", async () => {
        const trRelations = await Recipe.setTagsToRecipe([testTagIds[3], testTagIds[4]], testRecipeIds[0]);
        expect(trRelations).toEqual(expect.objectContaining({
            message: "tags-to-recipes relationships created successfully"
        }));
    });
    test("throws BadRequestError if recipe_id/tag_ids not found", async () => {
        try {
            await Recipe.setTagsToRecipe();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
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
    test("updates recipe's ingredients", async () => {
        const ingredientIds = [testIngredientIds[5], testIngredientIds[6]];
        const updatedRecipe = await Recipe.update(testRecipeIds[0], { ingredients: ingredientIds });
        expect(updatedRecipe).toEqual(expect.objectContaining({
            ingredients: expect.arrayContaining([
                expect.objectContaining({
                    ingredient_name: "ingredient6",
                }),
                expect.objectContaining({
                    ingredient_name: "ingredient7",
                }),
            ]),
        }));
    });
    test("updates recipe's categories", async () => {
        const category_ids = [testCategoriesIds[3], testCategoriesIds[4]];
        const updatedRecipe = await Recipe.update(testRecipeIds[0], { categories: category_ids });
        expect(updatedRecipe).toEqual(expect.objectContaining({
            title: "Recipe1",
            categories: expect.arrayContaining([
                expect.objectContaining({
                    category_name: "category4",
                }),
                expect.objectContaining({
                    category_name: "category5",
                }),
            ]),
        }));
    });
    test("updates recipe's tags", async () => {
        const tagIds = [testTagIds[3], testTagIds[4]];
        const updatedRecipe = await Recipe.update(testRecipeIds[0], { tags: tagIds});
        expect(updatedRecipe).toEqual(expect.objectContaining({
            tags: expect.arrayContaining([
                expect.objectContaining({
                    tag_name: "tag4",
                }),
                expect.objectContaining({
                    tag_name: "tag5",
                }),
            ]),
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
