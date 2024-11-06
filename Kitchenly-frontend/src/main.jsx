import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, Form, Navigate, RouterProvider } from "react-router-dom";

/* route components */
import App from "./routes/App";
import ProtectedRoutes from "./components/ProtectedRoutes";

// General routes
import Home from "./routes/Home";
import FormLogin from "./routes/FormLogin";
import FormSignUp from "./routes/FormSignUp";

// Protected routes

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
        path: "/",
        element: <ProtectedRoutes/>,
        children: [
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
