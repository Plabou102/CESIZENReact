// src/router/index.tsx

import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import InformationsPage from "../pages/informations/informationPage";
import UsersPage from "../pages/users/usersPage";
import BreathingExercisesPage from "../pages/breathingExercises/breathingExercisesPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";
import AdminLayout from "../components/layout/AdminLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "informations", element: <InformationsPage /> },
      { path: "breathing-exercises", element: <BreathingExercisesPage /> },
    ],
  },
]);