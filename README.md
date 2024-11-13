# Kitchenly

Check out a preview on render: [https://capstone-project-kitchenly-frontend.onrender.com/](https://capstone-project-kitchenly-frontend.onrender.com/)

#### What is Kitchenly you ask?

Kitchenly aims to be an easier alternative to searching and saving recipes. Looking up a recipe typically involves clicking through links, making sure to dodge all the blog posts and notifications to sign up for newsletters that a website will throw at you, and just giving the user the actual recipe with options for saving, adding it to a board, etc. All in all, I wanted to create a recipe app to simplify the process of searching.

#### Features

- [x] Creating recipes
- [x] Save recipes
- [x] Adding Tags
- [x] Searching with filters.

#### Building

1. Install `npm` on your machine and postgresql. 
2. Clone this repository
3. run `npm install` to download all dependencies.
4. Make sure to also load dummy data to the backend with `psql < kitchenly.sql`
5. Finally to run the application with `npm run dev`

Tests are located in `/Kitchenly-backend` and can be ran by going into your terminal and running `$ npm test`

#### User Flow

1. You'll go through your website.
2. Login
3. Search for recipes
4. Save recipes
5. Create Recipes
6. Go through user profile where you can view your saved and created recipes.

#### Tech Stack
I used Node.js running PostgreSQL for my backend and Node.js with React for my frontend.
