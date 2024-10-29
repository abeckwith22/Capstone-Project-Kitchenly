-- users table; Saves user information, used for authenticating, etc.
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,  -- Fixed "PRIMARY VARCHAR(50)" to make "username" the primary key
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
        CHECK (POSITION('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

-- recipes table; recipes that are hosted on the website will go here.
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) REFERENCES users(username) ON DELETE SET NULL,  -- Changed INT to VARCHAR(50) for username reference
    title VARCHAR(255) NOT NULL,
    recipe_description TEXT,
    preparation_time INT,
    cooking_time INT,
    servings INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ingredients table; ingredients that are hosted on the website will go here.
CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    ingredient_name TEXT UNIQUE NOT NULL
);

-- categories table; lists a number of categories.
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

-- tags table; allows users to tag a recipe like "#easytomake" or "#fun"
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    tag_name VARCHAR(50) UNIQUE NOT NULL
);

-- ingredients_recipes table; references ingredients to each recipe.
CREATE TABLE ingredients_recipes (
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
    PRIMARY KEY (ingredient_id, recipe_id)
);

-- tags_recipes table; references tags to each recipe.
CREATE TABLE tags_recipes (
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    PRIMARY KEY (tag_id, recipe_id)
);

-- recipes_categories table; references recipes to categories they fall into.
CREATE TABLE recipes_categories (
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, category_id)
);

-- recipes_users table; recipes that users saved
CREATE TABLE recipes_users (
    username VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,  -- Changed INT to VARCHAR(50) for username reference
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (recipe_id, username)
);
