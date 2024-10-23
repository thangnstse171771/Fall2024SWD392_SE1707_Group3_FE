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
import ManageHome from "../pages/ManageAccount/ManageHome";
import MyKoiProfile from "../pages/My Koi Profile/MyKoiProfile.component";
import Shop from "../pages/Shop/Shop";
import RecommendationsList from "../pages/Recommendations/RecommendationsList.component";
import RecommendationsProducts from "../pages/Recommendations/RecommendationsProducts.component";
import ProtectedRoute from "./ProtectedRoute";
import BlogManagement from "../pages/Blog/BlogManagement.component";

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
        element: (
          <ProtectedRoute allowedRoles={["Customer", "Admin", "Manager"]}>
            <ManageKoi />
          </ProtectedRoute>
        ),
      },
      {
        path: "/manage-koi/my-koi",
        element: (
          <ProtectedRoute allowedRoles={["Customer", "Admin", "Manager"]}>
            <MyKoi />
          </ProtectedRoute>
        ),
      },
      {
        path: "/manage-koi/my-koi/:id",
        element: (
          <ProtectedRoute allowedRoles={["Customer", "Admin", "Manager"]}>
            <MyKoiProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/manage-koi/my-pond",
        element: (
          <ProtectedRoute allowedRoles={["Customer", "Admin", "Manager"]}>
            <MyPond />
          </ProtectedRoute>
        ),
      },
      {
        path: "/manage-koi/water-parameters",
        element: (
          <ProtectedRoute allowedRoles={["Customer", "Admin", "Manager"]}>
            <WaterParameters />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute allowedRoles={["Customer", "Admin", "Manager"]}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ShopCenter",
        element: <Shop />,
      },
      {
        path: "/pond-profile/:id",
        element: (
          <ProtectedRoute allowedRoles={["Customer", "Admin", "Manager"]}>
            <PondProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/customerList",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager", "staff"]}>
            <ManageHome />
          </ProtectedRoute>
        ),
      },
      {
        path: "/manage-koi/recommendations",
        element: (
          <ProtectedRoute allowedRoles={["Customer", "Manager", "staff"]}>
            <RecommendationsList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/manage-koi/recommendations/:id",
        element: (
          <ProtectedRoute allowedRoles={["Customer", "Manager", "staff"]}>
            <RecommendationsProducts />
        path: "/BlogManagement",
        element: (
          <ProtectedRoute allowedRoles={["staff"]}>
            <BlogManagement />
          </ProtectedRoute>
        ),
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
