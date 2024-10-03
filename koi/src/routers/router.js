import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/home/Home.component";
import About from "../pages/About/About";
import Header from "../components/Header/Header.component";
import Footer from "../components/Footer/Footer.component";
import Login from "../pages/Login/Login.component";
import Signup from "../pages/Signup/Signup.component";
import ManageKoi from "../pages/Manage Koi/ManageKoi.component";
import Profile from "../pages/Profile/Profile.component";
import MyKoi from "../pages/My Koi/MyKoi.component";
import MyPond from "../pages/My Pond/MyPond.component";
import WaterParameters from "../pages/Water Parameters/WaterParameters.component";
import PondProfile from "../pages/Pond Profile/PondProfile.component";

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
      },
      {
        path: "/pond-profile",
        element: <PondProfile />,
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
