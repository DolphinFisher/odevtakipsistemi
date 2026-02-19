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

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      if (!response.ok) {
        throw new Error('Duyurular yuklenirken bir hata olustu.');
      }
      const data = await response.json();
      setAnnouncements(data);
      calculateNewCount(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Duyurular yuklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        loading,
        error,
        newAnnouncementCount,
        refreshAnnouncements: fetchAnnouncements
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
