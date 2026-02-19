import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Homework {
  id: number;
  title: string;
  description: string;
  course: string;
  dueDate: string;
  createdAt: string;
  status: "aktif" | "gecmis";
  attachmentName?: string;
  attachmentUrl?: string;
  author: string;
}

interface HomeworkContextType {
  homeworks: Homework[];
  loading: boolean;
  error: string | null;
  addHomework: (homework: Omit<Homework, "id">) => void;
  deleteHomework: (id: number) => void;
  refreshHomeworks: () => void;
}

const HomeworkContext = createContext<HomeworkContextType | null>(null);

const STORAGE_KEY = "hazirlik_homeworks";

// Initial sample data if storage is empty
const INITIAL_HOMEWORKS: Homework[] = [
  {
    id: 1,
    title: "Essay Writing Task 1",
    description: "Write an essay about the advantages and disadvantages of technology in education. Minimum 300 words.",
    course: "Writing",
    dueDate: "25 Subat 2026",
    createdAt: new Date().toLocaleDateString('tr-TR'),
    status: "aktif",
    author: "Dr. Ayse Yilmaz"
  },
  {
    id: 2,
    title: "Grammar Exercises: Present Perfect",
    description: "Complete the exercises on page 45-48 in your workbook.",
    course: "Grammar",
    dueDate: "20 Subat 2026",
    createdAt: new Date().toLocaleDateString('tr-TR'),
    status: "gecmis",
    author: "Dr. Mehmet Demir"
  }
];

export function HomeworkProvider({ children }: { children: ReactNode }) {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHomeworks(JSON.parse(stored));
      } else {
        // If empty, set initial data
        setHomeworks(INITIAL_HOMEWORKS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HOMEWORKS));
      }
    } catch (err) {
      console.error("Failed to load homeworks from storage:", err);
      setError("Veriler yuklenirken bir hata olustu.");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToStorage = (newHomeworks: Homework[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHomeworks));
      setHomeworks(newHomeworks);
    } catch (err) {
      console.error("Failed to save to storage:", err);
      setError("Veriler kaydedilirken bir hata olustu.");
    }
  };

  const addHomework = (homeworkData: Omit<Homework, "id">) => {
    const newHomework: Homework = {
      ...homeworkData,
      id: Date.now(), // Generate unique ID based on timestamp
    };
    const updatedHomeworks = [newHomework, ...homeworks];
    saveToStorage(updatedHomeworks);
  };

  const deleteHomework = (id: number) => {
    const updatedHomeworks = homeworks.filter(h => h.id !== id);
    saveToStorage(updatedHomeworks);
  };

  const refreshHomeworks = () => {
    // Re-read from storage if needed (though state should be in sync)
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setHomeworks(JSON.parse(stored));
    }
  };

  return (
    <HomeworkContext.Provider
      value={{
        homeworks,
        loading,
        error,
        addHomework,
        deleteHomework,
        refreshHomeworks
      }}
    >
      {children}
    </HomeworkContext.Provider>
  );
}

export function useHomework() {
  const context = useContext(HomeworkContext);
  if (!context) {
    throw new Error("useHomework must be used within a HomeworkProvider");
  }
  return context;
}
