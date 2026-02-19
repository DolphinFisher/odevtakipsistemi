import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AnnouncementProvider } from "./context/AnnouncementContext";
import { HomeworkProvider } from "./context/HomeworkContext";
import { router } from "./routes";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AnnouncementProvider>
          <HomeworkProvider>
            <RouterProvider router={router} />
          </HomeworkProvider>
        </AnnouncementProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
