import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  PartyPopper,
  AlertCircle,
  Clock,
} from "lucide-react";

interface CalendarEvent {
  id: number;
  title: string;
  startDate: string;
  endDate?: string;
  type: "sinav" | "tatil" | "kayit" | "etkinlik" | "onemli";
  description?: string;
}

const calendarEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Bahar Donemi Baslangiic",
    startDate: "2026-02-02",
    type: "onemli",
    description: "2025-2026 Akademik Yili Bahar Donemi derslerin baslamasi",
  },
  {
    id: 2,
    title: "Ders Ekleme-Birakma Haftasi",
    startDate: "2026-02-02",
    endDate: "2026-02-06",
    type: "kayit",
    description: "Ders ekleme ve birakma islemleri",
  },
  {
    id: 3,
    title: "Vize Sinavlari",
    startDate: "2026-03-02",
    endDate: "2026-03-06",
    type: "sinav",
    description: "Bahar Donemi Ara Sinavlari",
  },
  {
    id: 4,
    title: "Ramazan Bayrami Tatili",
    startDate: "2026-03-28",
    endDate: "2026-04-01",
    type: "tatil",
    description: "Ramazan Bayrami resmi tatil",
  },
  {
    id: 5,
    title: "23 Nisan Ulusal Egemenlik Bayrami",
    startDate: "2026-04-23",
    type: "tatil",
    description: "Resmi tatil",
  },
  {
    id: 6,
    title: "1 Mayis Emek ve Dayanisma Gunu",
    startDate: "2026-05-01",
    type: "tatil",
    description: "Resmi tatil",
  },
  {
    id: 7,
    title: "19 Mayis Genclik ve Spor Bayrami",
    startDate: "2026-05-19",
    type: "tatil",
    description: "Resmi tatil",
  },
  {
    id: 8,
    title: "Final Sinavlari",
    startDate: "2026-06-01",
    endDate: "2026-06-12",
    type: "sinav",
    description: "Bahar Donemi Final Sinavlari",
  },
  {
    id: 9,
    title: "Butunleme Sinavlari",
    startDate: "2026-06-22",
    endDate: "2026-07-03",
    type: "sinav",
    description: "Butunleme sinav donemi",
  },
  {
    id: 10,
    title: "Yaz Tatili Baslangici",
    startDate: "2026-07-06",
    type: "tatil",
    description: "Yaz tatili baslangici",
  },
  {
    id: 11,
    title: "Konusma Kulubu Baslangiic",
    startDate: "2026-02-11",
    type: "etkinlik",
    description: "Ingilizce konusma kulubu yeni donem aktiviteleri basliyor",
  },
  {
    id: 12,
    title: "Film Gosterimi",
    startDate: "2026-02-20",
    type: "etkinlik",
    description: "The King's Speech film gosterimi ve tartisma oturumu",
  },
  {
    id: 13,
    title: "Proficiency Sinavi Sonuclari",
    startDate: "2026-02-15",
    type: "onemli",
    description: "Yeterlilik sinavi sonuclarinin ilan edilmesi",
  },
];

const typeConfig = {
  sinav: {
    label: "Sinav",
    icon: BookOpen,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    calendarBg: "bg-orange-100 text-orange-800",
  },
  tatil: {
    label: "Tatil",
    icon: PartyPopper,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    calendarBg: "bg-green-100 text-green-800",
  },
  kayit: {
    label: "Kayit",
    icon: GraduationCap,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    calendarBg: "bg-purple-100 text-purple-800",
  },
  etkinlik: {
    label: "Etkinlik",
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    calendarBg: "bg-blue-100 text-blue-800",
  },
  onemli: {
    label: "Onemli",
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    calendarBg: "bg-red-100 text-red-800",
  },
};

const monthNames = [
  "Ocak",
  "Subat",
  "Mart",
  "Nisan",
  "Mayis",
  "Haziran",
  "Temmuz",
  "Agustos",
  "Eylul",
  "Ekim",
  "Kasim",
  "Aralik",
];

const dayNames = ["Pzt", "Sal", "Car", "Per", "Cum", "Cmt", "Paz"];

export function AcademicCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(1); // February (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday-based
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    return calendarEvents.filter((event) => {
      if (event.endDate) {
        return dateStr >= event.startDate && dateStr <= event.endDate;
      }
      return event.startDate === dateStr;
    });
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const selectedDateEvents = selectedDate
    ? calendarEvents.filter((event) => {
        if (event.endDate) {
          return selectedDate >= event.startDate && selectedDate <= event.endDate;
        }
        return event.startDate === selectedDate;
      })
    : [];

  // Get upcoming events for sidebar
  const upcomingEvents = [...calendarEvents]
    .filter((e) => e.startDate >= "2026-02-18")
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1>Akademik Takvim</h1>
          <p className="text-sm text-muted-foreground">
            2025-2026 Akademik Yili Bahar Donemi
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(typeConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${config.bg} border ${config.border}`} />
            <span className="text-xs text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          {/* Month Navigation */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2>
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-xs text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="p-2 min-h-[80px] border-b border-r border-border bg-secondary/20"
              />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const events = getEventsForDate(day);
              const dateStr = `${currentYear}-${String(
                currentMonth + 1
              ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isToday = dateStr === "2026-02-18";
              const isSelected = dateStr === selectedDate;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-1.5 min-h-[80px] border-b border-r border-border cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-accent/5"
                      : "hover:bg-secondary/30"
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm ${
                      isToday
                        ? "bg-accent text-white"
                        : isSelected
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {events.slice(0, 2).map((event) => {
                      const config = typeConfig[event.type];
                      return (
                        <div
                          key={event.id}
                          className={`text-[10px] px-1 py-0.5 rounded truncate ${config.calendarBg}`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      );
                    })}
                    {events.length > 2 && (
                      <div className="text-[10px] text-muted-foreground px-1">
                        +{events.length - 2} daha
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected Date Events */}
          {selectedDate && selectedDateEvents.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="mb-3 text-sm">
                {selectedDate &&
                  `${parseInt(selectedDate.split("-")[2])} ${
                    monthNames[parseInt(selectedDate.split("-")[1]) - 1]
                  } ${selectedDate.split("-")[0]}`}
              </h3>
              <div className="space-y-3">
                {selectedDateEvents.map((event) => {
                  const config = typeConfig[event.type];
                  return (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg ${config.bg} border ${config.border}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <config.icon className={`w-4 h-4 ${config.color}`} />
                        <span className={`text-xs ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm">{event.title}</p>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="mb-3 text-sm">Yaklasan Etkinlikler</h3>
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const config = typeConfig[event.type];
                const dateObj = new Date(event.startDate);
                const day = dateObj.getDate();
                const month = monthNames[dateObj.getMonth()];

                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 group"
                  >
                    <div className="text-center shrink-0 w-12">
                      <p className="text-lg text-foreground leading-none">
                        {day}
                      </p>
                      <p className="text-xs text-muted-foreground">{month}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${config.bg} border ${config.border}`}
                        />
                        <span className={`text-[10px] ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm truncate">{event.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}