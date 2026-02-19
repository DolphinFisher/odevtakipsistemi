import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LoginPage } from "./components/LoginPage";
import { DashboardPage } from "./components/DashboardPage";
import { AnnouncementsPage } from "./components/AnnouncementsPage";
import { HomeworkPage } from "./components/HomeworkPage";
import { AcademicCalendarPage } from "./components/AcademicCalendarPage";
import { NotFoundPage } from "./components/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "duyurular", element: <AnnouncementsPage /> },
      { path: "odevler", element: <HomeworkPage /> },
      { path: "akademik-takvim", element: <AcademicCalendarPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
