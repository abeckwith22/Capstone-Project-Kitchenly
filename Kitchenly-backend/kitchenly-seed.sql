-- Seed users
INSERT INTO users (username, password, first_name, last_name, email, is_admin)
VALUES 
    ('chef_john', 'hashed_password_1', 'John', 'Doe', 'john@example.com', TRUE),
    ('foodie_jane', 'hashed_password_2', 'Jane', 'Smith', 'jane@example.com', FALSE),
    ('tasty_tom', 'hashed_password_3', 'Tom', 'Taylor', 'tom@example.com', FALSE);

-- Seed categories
INSERT INTO categories (category_name)
VALUES 
    ('Appetizer'),
    ('Main Course'),
    ('Dessert'),
    ('Vegetarian'),
    ('Vegan');

-- Seed tags
INSERT INTO tags (tag_name)
VALUES 
    ('#easy'),
    ('#quick'),
    ('#healthy'),
    ('#glutenfree'),
    ('#comfortfood');

-- Seed ingredients
INSERT INTO ingredients (ingredient_name)
VALUES 
    ('Flour'),
    ('Sugar'),
    ('Butter'),
    ('Eggs'),
    ('Milk'),
    ('Salt'),
    ('Garlic'),
    ('Tomato'),
    ('Basil');

-- Seed recipes
INSERT INTO recipes (username, title, recipe_description, preparation_time, cooking_time, servings)
VALUES 
    ('chef_john', 'Classic Pancakes', 'Fluffy and delicious pancakes.', 10, 20, 4),
    ('foodie_jane', 'Garlic Spaghetti', 'Spaghetti with garlic, tomato, and basil.', 5, 15, 2),
    ('tasty_tom', 'Vegan Brownies', 'Rich, chocolate vegan brownies.', 15, 30, 8);

-- Seed ingredients_recipes
INSERT INTO ingredients_recipes (recipe_id, ingredient_id)
VALUES 
    (1, 1),  -- Pancakes need flour
    (1, 2),  -- Pancakes need sugar
    (1, 3),  -- Pancakes need butter
    (1, 4),  -- Pancakes need eggs
    (1, 5),  -- Pancakes need milk
    (2, 7),  -- Spaghetti needs garlic
    (2, 8),  -- Spaghetti needs tomato
    (2, 9),  -- Spaghetti needs basil
    (3, 2),  -- Brownies need sugar
    (3, 5);  -- Brownies need milk

-- Seed tags_recipes
INSERT INTO tags_recipes (tag_id, recipe_id)
VALUES 
    (1, 1),  -- Pancakes are #easy
    (2, 2),  -- Spaghetti is #quick
    (3, 3),  -- Brownies are #healthy
    (2, 3),  -- Brownies are #quick
    (1, 3);  -- Brownies are #easy

-- Seed recipes_categories
INSERT INTO recipes_categories (recipe_id, category_id)
VALUES 
    (1, 2),  -- Pancakes are Main Course
    (2, 2),  -- Spaghetti is Main Course
    (3, 3);  -- Brownies are Dessert

-- Seed recipes_users (saved recipes)
INSERT INTO recipes_users (username, recipe_id, saved_at)
VALUES 
    ('chef_john', 2, CURRENT_TIMESTAMP),  -- Chef John saved Garlic Spaghetti
    ('foodie_jane', 1, CURRENT_TIMESTAMP),  -- Foodie Jane saved Classic Pancakes
    ('tasty_tom', 3, CURRENT_TIMESTAMP);  -- Tasty Tom saved Vegan Brownies
