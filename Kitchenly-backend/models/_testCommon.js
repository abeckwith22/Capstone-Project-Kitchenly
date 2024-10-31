const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

const testRecipeIds = [];
const testIngredientIds = [];
const testCategoriesIds = [];
const testTagIds = [];

async function commonBeforeAll() {
  // Clean out the tables
  await db.query("DELETE FROM recipes_users");
  await db.query("DELETE FROM recipes");
  await db.query("DELETE FROM ingredients");
  await db.query("DELETE FROM categories");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM tags");

  // Insert test users
  await db.query(`
    INSERT INTO users (username, password, first_name, last_name, email, is_admin)
    VALUES ('user1', $1, 'User1First', 'User1Last', 'user1@example.com', FALSE),
           ('user2', $2, 'User2First', 'User2Last', 'user2@example.com', TRUE)
  `, [
    await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
    await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
  ]);

  // Insert test ingredients
  const resultsIngredients = await db.query(`
    INSERT INTO ingredients (ingredient_name)
    VALUES ('ingredient1'),
           ('ingredient2'),
           ('ingredient3')
    RETURNING id
  `);
  // adds ids to ingredient to references them later
  testIngredientIds.splice(0, 0, ...resultsIngredients.rows.map(r => r.id));

  // Insert test recipes
  const resultsRecipes = await db.query(`
    INSERT INTO recipes (username, title, recipe_description, preparation_time, cooking_time, servings)
    VALUES ('user1', 'Recipe1', 'Delicious dish 1', 10, 20, 2),
           ('user2', 'Recipe2', 'Tasty meal 2', 15, 30, 4),
           ('user1', 'Recipe3', 'Amazing dish 3', 5, 15, 1)
    RETURNING id
  `);
  testRecipeIds.splice(0, 0, ...resultsRecipes.rows.map(r => r.id));

  // Insert test categories
  const resultsCategories = await db.query(`
    INSERT INTO categories (category_name)
    VALUES ('category1'),
           ('category2'),
           ('category3'),
           ('category4'),
           ('category5'),
           ('category6'),
           ('category7'),
           ('category8'),
           ('category9'),
           ('category10')
    RETURNING id
  `);
  testCategoriesIds.splice(0, 0, ...resultsCategories.rows.map(r => r.id));

  // Insert test tags
  const resultTags = await db.query(`
    INSERT INTO tags (tag_name)
    VALUES ('tag1'),
           ('tag2'),
           ('tag3'),
           ('tag4'),
           ('tag5'),
           ('tag6'),
           ('tag7'),
           ('tag8'),
           ('tag9'),
           ('tag10')
    RETURNING id
  `);
  testTagIds.splice(0, 0, ...resultTags.rows.map(r => r.id));

  // Associate user with saved recipes
  await db.query(`
    INSERT INTO recipes_users (recipe_id, username)
    VALUES ($1, 'user1'), ($2, 'user2')`,
    [testRecipeIds[0], testRecipeIds[1]]
  );
  
  // Associate tags with recipes
  await db.query(`
    INSERT INTO tags_recipes (tag_id, recipe_id)
    VALUES ($1, $2), ($3, $4), ($5, $6)`,
    [testTagIds[0], testRecipeIds[0], testTagIds[0], testRecipeIds[1], testTagIds[1], testRecipeIds[0]]
  );
  
  // Associate categories with recipes
  await db.query(`
    INSERT INTO recipes_categories (recipe_id, category_id)
    VALUES ($1, $2), ($3, $4), ($5, $6)`,
    [testRecipeIds[0], testCategoriesIds[0], testRecipeIds[0], testCategoriesIds[1], testRecipeIds[1], testCategoriesIds[0]]
  );

}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testRecipeIds,
  testIngredientIds,
  testCategoriesIds,
  testTagIds,
};
