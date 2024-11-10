import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/* route components */
import App from "./routes/App";
import ProtectedRoutes from "./components/ProtectedRoutes";

// General routes
import Home from "./routes/Home";
import Logout from "./routes/Logout";

// Protected routes
import Profile from "./routes/Profile";
import RecipeList from "./routes/RecipeList";
import Details from "./routes/Details";

// Forms
import FormCreateRecipe from "./routes/FormCreateRecipe";
import FormLogin from "./routes/FormLogin";
import FormSignUp from "./routes/FormSignUp";

/* error components */
import ErrorElement from "./components/ErrorElement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/login",
        element: <FormLogin/>
      },
      {
        path: "/signup",
        element: <FormSignUp/>
      },
      {
        path: "/logout",
        element: <Logout/>
      },
      {
        element: <ProtectedRoutes/>,
        children: [
          {
            path: "/profile",
            element: <Profile/>
          },
          {
            path: "/recipes",
            element: <RecipeList/>
          },
          {
            path: "/recipes/:recipe_id",
            element: <Details/>,
          },
          {
            path: "/recipes/filter/tags",
            element: <RecipeList/>
          },
          {
            path: "/recipes/filter/categories",
            element: <RecipeList/>
          },
          {
            path: "/recipes/new",
            element: <FormCreateRecipe/>
          },
        ],
      }
    ],
    errorElement: <ErrorElement/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
