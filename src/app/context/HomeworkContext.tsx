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
  isOffline: boolean;
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
  const [isOffline, setIsOffline] = useState(false);

  const fetchHomeworks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/homeworks');
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setHomeworks(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setIsOffline(false);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        const fallback = stored ? JSON.parse(stored) : INITIAL_HOMEWORKS;
        setHomeworks(fallback);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch homeworks from API:", err);
      setIsOffline(true);
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setHomeworks(JSON.parse(stored));
        } else {
          setHomeworks(INITIAL_HOMEWORKS);
        }
        setError(null);
      } catch (fallbackErr) {
        setError("Veriler yuklenirken bir hata olustu.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const addHomework = async (homeworkData: Omit<Homework, "id">) => {
    try {
      const response = await fetch('/api/homeworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homeworkData),
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      await fetchHomeworks();
      setIsOffline(false);
    } catch (err) {
      console.error("Failed to add homework:", err);
      setIsOffline(true);
      // Fallback: add locally
      const newHomework: Homework = { ...homeworkData, id: Date.now() };
      const updated = [newHomework, ...homeworks];
      setHomeworks(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const deleteHomework = async (id: number) => {
    try {
      const response = await fetch(`/api/homeworks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      await fetchHomeworks();
      setIsOffline(false);
    } catch (err) {
      console.error("Failed to delete homework:", err);
      setIsOffline(true);
      // Fallback: delete locally
      const updated = homeworks.filter(h => h.id !== id);
      setHomeworks(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const refreshHomeworks = () => {
    fetchHomeworks();
  };

  return (
    <HomeworkContext.Provider
      value={{
        homeworks,
        loading,
        error,
        isOffline,
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
