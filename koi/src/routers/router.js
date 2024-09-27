import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/home/Home.component";
import About from "../pages/About/About";
import Header from "../components/Header/Header.component";
import Footer from "../components/Footer/Footer.component";
import Login from "../pages/Login/Login.component";
import Signup from "../pages/Signup/Signup.component";
import ManageKoi from "../pages/Manage Koi/ManageKoi.component";
import ManageHome from "../pages/ManageCustomer/ManageHome";
// import CustomerList from "../pages/ManageCustomer/CustomerList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <Header />
        <Outlet />
        <Footer />
      </div>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/manage",
        element: <ManageKoi />,
      },
      {
        path: "/CustomerList",
        element: <ManageHome />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Sign-in",
    element: <Signup />,
  },
]);
