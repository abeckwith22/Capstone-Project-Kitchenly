const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

const { createToken } = require("../helpers/tokens.js");
const User = require("../models/user.js");
const Recipe = require("../models/recipe.js");
const Ingredient = require("../models/ingredient.js");
const Category = require("../models/category.js");
const Tag = require("../models/tag.js");

const recipeIds = [];
const ingredientIds = [];
const categoriesIds = [];
const tagIds = [];

async function commonBeforeAll() {
  // clean out the tables
  await db.query("DELETE FROM recipes_users");
  await db.query("DELETE FROM recipes");
  await db.query("DELETE FROM ingredients");
  await db.query("DELETE FROM categories");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM tags");

  const ingredients_arr = [
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
    "Olive Oil",
    "White Bread",
    "Whole Wheat Bread",
    "Leek",
    "Kale",
    "Scallion",
    "White Onion",
    "Red Onion",
    "Vidalia Onion",
    "Cheddar Jack Cheese",
    "Mozzerella Cheese",
    "Cream Cheese",
    "Kiwi",
    "Banana",
    "Red Grapes",
    "Black Grapes",
    "Green Grapes",
    "Guacamole",
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
  ]
  
  // create ingredients
  await Ingredient.create({ ingredient_names: ingredients_arr });

  // create categories
  await Category.create({ category_name : "Breakfast" });
  await Category.create({ category_name : "Lunch" });
  await Category.create({ category_name : "Dinner" });
  await Category.create({ category_name : "Snack" });
  await Category.create({ category_name : "American" });
  await Category.create({ category_name : "Mexican" });
  await Category.create({ category_name : "Chinese" });
  await Category.create({ category_name : "Japanese" });
  await Category.create({ category_name : "Indian" });

  // create tags
  await Tag.create({ tag_name: "cool" });
  await Tag.create({ tag_name: "fun" });
  await Tag.create({ tag_name: "exciting" });
  await Tag.create({ tag_name: "easy-to-make" });
  await Tag.create({ tag_name: "sweet" });
  await Tag.create({ tag_name: "savory" });
  await Tag.create({ tag_name: "kid-friendly" });
  await Tag.create({ tag_name: "good-for-breakfast" });
  await Tag.create({ tag_name: "quick" });
  await Tag.create({ tag_name: "challenging" });

  // register test users
  await User.register({
    username: "u1",
    password: "password1",
    first_name: "U1F",
    last_name: "U1L",
    email: "user1@user.com",
    is_admin: false
  });
  await User.register({
    username: "u2",
    password: "password2",
    first_name: "U2F",
    last_name: "U2L",
    email: "user2@user.com",
    is_admin: false
  });
  await User.register({
    username: "u3",
    password: "password3",
    first_name: "U3F",
    last_name: "U3L",
    email: "user3@email.com",
    is_admin: false
  });

  // create recipes
  const recipe1 = await Recipe.create({
    username: "u1",
    title: "Cereal",
    recipe_description: "Milk and cereal of your choice into a bowl, mix and serve with a spoon!",
    preparation_time: 5,
    cooking_time: 0,
    servings: 1,
    ingredients: [ "Milk", "Rice Crispies" ],
    tags: [ "easy", "good-for-breakfast", "quick", "kid-friendly" ],
    categories: [ "Breakfast" ]
  });

  const recipe2 = await Recipe.create({
    username: "u2",
    title: "Grilled Cheese",
    recipe_description: "A delicious, gooey, and savory meal",
    preparation_time: 10,
    cooking_time: 5,
    servings: 1,
    ingredients: [ "Cheese", "White Bread" ],
    tags: [ "easy", "savory", "quick", "kid-friendly" ],
    categories: [ "Snack", "Lunch" ],
  });

  const recipe3 = await Recipe.create({
    username: "u1",
    title: "Tacos",
    recipe_description: "Prepare, beef, romaine lettuce, guacamole, sour cream, and a cheese of your choice and place them on a tortilla shell. Finally, wrap it up and enjoy!",
    preparation_time: 10,
    cooking_time: 10,
    servings: 1,
    ingredients: [ "Tortilla", "Beef", "Romaine Lettuce", "Guacamole", "Sour Cream", "Cheddar Cheese" ],
    tags: [ "easy", "savory", "quick", "exciting" ],
    categories: [ "Lunch", "Dinner", "Mexican" ],
  });

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
  recipeIds,
};
