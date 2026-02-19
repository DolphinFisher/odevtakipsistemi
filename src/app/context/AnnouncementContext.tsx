import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  category: "onemli" | "etkinlik" | "bilgi" | "sinav";
  pinned: boolean;
  author: string;
  link?: string;
}

interface AnnouncementContextType {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  newAnnouncementCount: number;
  refreshAnnouncements: () => Promise<void>;
}

const AnnouncementContext = createContext<AnnouncementContextType | null>(null);

const monthMap: { [key: string]: number } = {
  "Ocak": 0, "Şubat": 1, "Mart": 2, "Nisan": 3, "Mayıs": 4, "Haziran": 5,
  "Temmuz": 6, "Ağustos": 7, "Eylül": 8, "Ekim": 9, "Kasım": 10, "Aralık": 11,
  "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5,
  "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
};

const STORAGE_KEY = "announcements_data";

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "Bahar Donemi Baslangici",
    content: "2025-2026 Egitim Ogretim Yili Bahar Donemi 16 Subat 2026 tarihinde baslayacaktir.",
    date: "10 Subat 2026",
    category: "onemli",
    pinned: true,
    author: "Ogrenci Isleri",
  },
  {
    id: 2,
    title: "Kampus Giris Kartlari Hakkinda",
    content: "Ogrenci kimlik kartlarinin yenilenmesi gerekmektedir. Lutfen ogrenci islerine basvurunuz.",
    date: "12 Subat 2026",
    category: "bilgi",
    pinned: false,
    author: "Guvenlik Birimi",
  },
  {
    id: 3,
    title: "Kutuphane Calisma Saatleri",
    content: "Sinav donemi boyunca kutuphanemiz 7/24 hizmet verecektir.",
    date: "14 Subat 2026",
    category: "bilgi",
    pinned: false,
    author: "Kutuphane Mudurlugu",
  },
  {
    id: 4,
    title: "Bahar Senligi Etkinlikleri",
    content: "Bahar senligi kapsaminda duzenlenecek konserler ve etkinlikler icin takvim yayinlandi.",
    date: "15 Subat 2026",
    category: "etkinlik",
    pinned: false,
    author: "Kultur Sanat K.",
  }
];

const parseDate = (dateStr: string): Date | null => {
  try {
    // Format examples: "13 Şubat 2026", "13.02.2026", "13 Feb 2026"
    const parts = dateStr.split(" ");
    if (parts.length >= 3) {
      const day = parseInt(parts[0]);
      const monthName = parts[1];
      const year = parseInt(parts[2]);
      const month = monthMap[monthName];

      if (!isNaN(day) && !isNaN(year) && month !== undefined) {
        return new Date(year, month, day);
      }
    }
    return null;
  } catch (e) {
    return null;
  }
};

export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAnnouncementCount, setNewAnnouncementCount] = useState(0);

  const calculateNewCount = (data: Announcement[]) => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));

    const count = data.filter(a => {
      const aDate = parseDate(a.date);
      if (!aDate) return false;
      return aDate >= threeDaysAgo;
    }).length;

    setNewAnnouncementCount(count);
  };

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/announcements');
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setAnnouncements(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        calculateNewCount(data);
      } else {
        // API returned empty, fall back to cached or initial
        const stored = localStorage.getItem(STORAGE_KEY);
        const fallback = stored ? JSON.parse(stored) : INITIAL_ANNOUNCEMENTS;
        setAnnouncements(fallback);
        calculateNewCount(fallback);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch announcements from API:", err);
      // Fall back to localStorage cache or initial data
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          setAnnouncements(data);
          calculateNewCount(data);
          setError(null);
        } else {
          setAnnouncements(INITIAL_ANNOUNCEMENTS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ANNOUNCEMENTS));
          calculateNewCount(INITIAL_ANNOUNCEMENTS);
          setError(null);
        }
      } catch (fallbackErr) {
        console.error("Fallback also failed:", fallbackErr);
        setError("Duyurular yuklenirken bir hata olustu.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const refreshAnnouncements = async () => {
    await loadAnnouncements();
  };

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        loading,
        error,
        newAnnouncementCount,
        refreshAnnouncements
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncement() {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error("useAnnouncement must be used within an AnnouncementProvider");
  }
  return context;
}
