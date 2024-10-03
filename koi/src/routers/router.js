import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/home/Home.component";
import About from "../pages/About/About";
import Header from "../components/Header/Header.component";
import Footer from "../components/Footer/Footer.component";
import Login from "../pages/Login/Login.component";
import Signup from "../pages/Signup/Signup.component";
import ManageKoi from "../pages/Manage Koi/ManageKoi.component";
<<<<<<< HEAD
import ManageHome from "../pages/ManageCustomer/ManageHome";
// import CustomerList from "../pages/ManageCustomer/CustomerList";
=======
import Profile from "../pages/Profile/Profile.component";
import MyKoi from "../pages/My Koi/MyKoi.component";
import MyPond from "../pages/My Pond/MyPond.component";
import WaterParameters from "../pages/Water Parameters/WaterParameters.component";
>>>>>>> bd23f24ffe5c67914ee428bfe30cff70dc9ef1d9

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
        path: "/manage-koi",
        element: <ManageKoi />,
      },
      {
<<<<<<< HEAD
        path: "/CustomerList",
        element: <ManageHome />,
=======
        path: "/manage-koi/my-koi",
        element: <MyKoi />,
      },
      {
        path: "/manage-koi/my-pond",
        element: <MyPond />,
      },
      {
        path: "/manage-koi/water-parameters",
        element: <WaterParameters />,
      },
      {
        path: "/profile",
        element: <Profile />,
>>>>>>> bd23f24ffe5c67914ee428bfe30cff70dc9ef1d9
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
