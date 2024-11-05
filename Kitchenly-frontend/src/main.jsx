import { createContext, StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

/* route components */
import App from "./routes/App";

import Home from "./routes/Home";

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
