const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

const { createToken } = require("../helpers/tokens.js");
const User = require("../models/user.js");
const Recipe = require("../models/recipe.js");
const Ingredient = require("../models/ingredient.js");
const Category = require("../models/category.js");
const Tag = require("../models/tag.js");

const ingredientIds = [];
const categoryIds = [];
const tagIds = [];
const userIds = [];
const recipeIds = [];

async function commonBeforeAll() {
  // clean out the tables
  await db.query("DELETE FROM recipes_users");
  await db.query("DELETE FROM recipes");
  await db.query("DELETE FROM ingredients");
  await db.query("DELETE FROM categories");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM tags");

  const ingredients_arr = [
    "Tortilla",
    "Beef",
    "Romaine Lettuce",
    "Guacamole",
    "Sour Cream",
    "Flour", 
    "White Egg",
    "Brown Egg",
    "Baking Soda",
    "McIntosh Apple",
    "Granny Smith Apple",
    "Honeycrisp Apple",
    "Roma Tomato",
    "Beefsteak Tomato",
    "Heirloom Tomato",
    "Tomato Paste",
    "Whole Milk",
    "Cereal",
    "Olive Oil",
    "White Bread",
    "Whole Wheat Bread",
    "Leek",
    "Kale",
    "Scallion",
    "White Onion",
    "Red Onion",
    "Vidalia Onion",
    "Cheddar Cheese",
    "Cheddar Jack Cheese",
    "Mozzerella Cheese",
    "Cream Cheese",
    "Kiwi",
    "Banana",
    "Red Grapes",
    "Black Grapes",
    "Green Grapes",
    "Mild Salsa",
    "Medium Salsa",
    "Hot Salsa",
    "White Wine",
    "Red Wine",
    "Bean Sprouts",
    "Green Beans",
    "Asparagus",
    "Broccoli",
    "Basil",
    "Mint",
    "Cinnamon",
    "Rosemary",
    "Thyme",
  ];
  
  // create ingredients
  const ingredients = await Ingredient.create({ ingredient_names: ingredients_arr });
  ingredientIds.push(...ingredients.map(i => i.id));
  
  // create categories
  const category1 = await Category.create({ category_name : "Breakfast" });
  const category2 = await Category.create({ category_name : "Lunch" });
  const category3 = await Category.create({ category_name : "Dinner" });
  const category4 = await Category.create({ category_name : "Snack" });
  const category5 = await Category.create({ category_name : "American" });
  const category6 = await Category.create({ category_name : "Mexican" });
  const category7 = await Category.create({ category_name : "Chinese" });
  const category8 = await Category.create({ category_name : "Japanese" });
  const category9 = await Category.create({ category_name : "Indian" });

  // push ids to arr
  categoryIds.push(category1.id,category2.id,category3.id,category4.id,category5.id,category6.id,category7.id,category8.id,category9.id);

  // create tags
  const tag1 = await Tag.create({ tag_name: "cool" });
  const tag2 = await Tag.create({ tag_name: "fun" });
  const tag3 = await Tag.create({ tag_name: "exciting" });
  const tag4 = await Tag.create({ tag_name: "easy-to-make" });
  const tag5 = await Tag.create({ tag_name: "sweet" });
  const tag6 = await Tag.create({ tag_name: "savory" });
  const tag7 = await Tag.create({ tag_name: "kid-friendly" });
  const tag8 = await Tag.create({ tag_name: "good-for-breakfast" });
  const tag9 = await Tag.create({ tag_name: "quick" });
  const tag10 = await Tag.create({ tag_name: "challenging" });

  // push ids to arr
  tagIds.push(tag1.id, tag2.id, tag3.id, tag4.id, tag5.id, tag6.id, tag7.id, tag8.id, tag9.id, tag10.id)

  // register test users
  const user1 = await User.register({
    username: "u1",
    password: "password1",
    first_name: "U1F",
    last_name: "U1L",
    email: "user1@user.com",
    is_admin: false
  });
  const user2 = await User.register({
    username: "u2",
    password: "password2",
    first_name: "U2F",
    last_name: "U2L",
    email: "user2@user.com",
    is_admin: false
  });
  const user3 = await User.register({
    username: "u3",
    password: "password3",
    first_name: "U3F",
    last_name: "U3L",
    email: "user3@email.com",
    is_admin: false
  });
  userIds.push(user1.id, user2.id, user3.id);

  // create recipes
  const recipe1 = await Recipe.create({
    username: "u1",
    title: "Cereal",
    recipe_description: "Milk and cereal of your choice into a bowl, mix and serve with a spoon!",
    preparation_time: 5,
    cooking_time: 0,
    servings: 1,
    ingredients: [ ingredientIds[15], ingredientIds[16] ],
    tags: [ tagIds[3], tagIds[7], tagIds[8], tagIds[6] ],
    categories: [ categoryIds[0] ],
  });

  const recipe2 = await Recipe.create({
    username: "u2",
    title: "Grilled Cheese",
    recipe_description: "A delicious, gooey, and savory meal",
    preparation_time: 10,
    cooking_time: 5,
    servings: 1,
    ingredients: [ ingredientIds[25], ingredientIds[17] ], // cheddar cheese, white bread
    tags: [ tagIds[3], tagIds[5], tagIds[8], tagIds[6] ], // #easy, #savory, #quick, #kid-friendly
    categories: [ categoryIds[3], categoryIds[1]], // snack, lunch
  });

  const recipe3 = await Recipe.create({
    username: "u1",
    title: "Tacos",
    recipe_description: "Prepare, beef, romaine lettuce, guacamole, sour cream, and a cheese of your choice and place them on a tortilla shell. Finally, wrap it up and enjoy!",
    preparation_time: 10,
    cooking_time: 10,
    servings: 1,
    ingredients: [ ingredientIds[0], ingredientIds[1], ingredientIds[2], ingredientIds[3], ingredientIds[25] ],
    tags: [ tagIds[3], tagIds[5], tagIds[8], tagIds[2] ],
    categories: [ categoryIds[1], categoryIds[2], categoryIds[5] ],
  });

  // push ids to arr
  recipeIds.push(recipe1.id, recipe2.id, recipe3.id);
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

const u1Token = createToken({ username: "u1", is_admin: false });
const u2Token = createToken({ username: "u2", is_admin: false });
const adminToken = createToken({ username: "admin", is_admin: true });

module.exports = {
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
};
