import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home.component";
import About from "../pages/About/About";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);
