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
    title: "Ingilizce Yeterlilik Sinavi (YAZILI)",
    startDate: "2025-09-09",
    endDate: "2025-09-09",
    type: "sinav",
    description: "Yazili Yeterlilik Sinavi",
  },
  {
    id: 2,
    title: "Ingilizce Yeterlilik Sinavi (SOZLU)",
    startDate: "2025-09-10",
    endDate: "2025-09-11",
    type: "sinav",
    description: "Sozlu Yeterlilik Sinavi",
  },
  {
    id: 3,
    title: "Sinav Sonuclarinin Yayinlanmasi",
    startDate: "2025-09-12",
    endDate: "2025-09-12",
    type: "onemli",
    description: "Yeterlilik Sinavi Sonuclari",
  },
  {
    id: 4,
    title: "Sinav Sonucuna Itiraz",
    startDate: "2025-09-12",
    endDate: "2025-09-17",
    type: "onemli",
    description: "Yeterlilik Sinavi Itiraz Donemi",
  },
  {
    id: 5,
    title: "1. Dilim Dersleri",
    startDate: "2025-09-29",
    endDate: "2025-11-18",
    type: "etkinlik",
    description: "1. Dilim Ders Donemi",
  },
  {
    id: 6,
    title: "TAT1 (SOZLU)",
    startDate: "2025-11-20",
    endDate: "2025-11-21",
    type: "sinav",
    description: "TAT1 Sozlu Sinavi",
  },
  {
    id: 7,
    title: "TAT1 (YAZILI)",
    startDate: "2025-11-22",
    endDate: "2025-11-22",
    type: "sinav",
    description: "TAT1 Yazili Sinavi",
  },
  {
    id: 8,
    title: "Mazeret Sinav Basvurusu",
    startDate: "2025-11-20",
    endDate: "2025-11-24",
    type: "kayit",
    description: "TAT1 Mazeret Sinavi Basvurusu",
  },
  {
    id: 9,
    title: "Sinav Sonuclarinin Yayinlanmasi",
    startDate: "2025-11-24",
    endDate: "2025-11-24",
    type: "onemli",
    description: "TAT1 Sinav Sonuclari",
  },
  {
    id: 10,
    title: "TAT1 Sonucuna Itiraz",
    startDate: "2025-11-24",
    endDate: "2025-11-27",
    type: "onemli",
    description: "TAT1 Itiraz Donemi",
  },
  {
    id: 11,
    title: "2. Dilim Dersleri",
    startDate: "2025-11-24",
    endDate: "2026-01-16",
    type: "etkinlik",
    description: "2. Dilim Ders Donemi",
  },
  {
    id: 12,
    title: "Mazeret Sinavi",
    startDate: "2025-11-27",
    endDate: "2025-11-27",
    type: "sinav",
    description: "TAT1 Mazeret Sinavi",
  },
  {
    id: 13,
    title: "TAT2 (SOZLU)",
    startDate: "2026-01-15",
    endDate: "2026-01-16",
    type: "sinav",
    description: "TAT2 Sozlu Sinavi",
  },
  {
    id: 14,
    title: "TAT2 (YAZILI)",
    startDate: "2026-01-17",
    endDate: "2026-01-17",
    type: "sinav",
    description: "TAT2 Yazili Sinavi",
  },
  {
    id: 15,
    title: "Mazeret Sinav Basvurusu",
    startDate: "2026-01-15",
    endDate: "2026-01-20",
    type: "kayit",
    description: "TAT2 Mazeret Sinavi Basvurusu",
  },
  {
    id: 16,
    title: "Sinav Sonuclarinin Yayinlanmasi",
    startDate: "2026-01-20",
    endDate: "2026-01-20",
    type: "onemli",
    description: "TAT2 Sinav Sonuclari",
  },
  {
    id: 17,
    title: "Ara Donem Muafiyet Sinav Basvurusu",
    startDate: "2026-01-20",
    endDate: "2026-01-23",
    type: "kayit",
    description: "Muafiyet Sinavi Basvurusu",
  },
  {
    id: 18,
    title: "TAT2 Sonucuna Itiraz",
    startDate: "2026-01-20",
    endDate: "2026-01-23",
    type: "onemli",
    description: "TAT2 Itiraz Donemi",
  },
  {
    id: 19,
    title: "Mazeret Sinavi",
    startDate: "2026-01-23",
    endDate: "2026-01-23",
    type: "sinav",
    description: "TAT2 Mazeret Sinavi",
  },
  {
    id: 20,
    title: "Ara Donem Muafiyet Sinavi",
    startDate: "2026-01-27",
    endDate: "2026-01-27",
    type: "sinav",
    description: "Muafiyet Sinavi",
  },
  {
    id: 21,
    title: "3. Dilim Dersleri",
    startDate: "2026-02-16",
    endDate: "2026-04-10",
    type: "etkinlik",
    description: "3. Dilim Ders Donemi",
  },
  {
    id: 22,
    title: "TAT3 (YAZILI)",
    startDate: "2026-04-11",
    endDate: "2026-04-11",
    type: "sinav",
    description: "TAT3 Yazili Sinavi",
  },
  {
    id: 23,
    title: "TAT3 (SOZLU)",
    startDate: "2026-04-13",
    endDate: "2026-04-14",
    type: "sinav",
    description: "TAT3 Sozlu Sinavi",
  },
  {
    id: 24,
    title: "Mazeret Sinav Basvurusu",
    startDate: "2026-04-11",
    endDate: "2026-04-16",
    type: "kayit",
    description: "TAT3 Mazeret Sinavi Basvurusu",
  },
  {
    id: 25,
    title: "Sinav Sonuclarinin Yayinlanmasi",
    startDate: "2026-04-16",
    endDate: "2026-04-16",
    type: "onemli",
    description: "TAT3 Sinav Sonuclari",
  },
  {
    id: 26,
    title: "Mazeret Sinavi",
    startDate: "2026-04-17",
    endDate: "2026-04-17",
    type: "sinav",
    description: "TAT3 Mazeret Sinavi",
  },
  {
    id: 27,
    title: "TAT3 Sonucuna Itiraz",
    startDate: "2026-04-16",
    endDate: "2026-04-21",
    type: "onemli",
    description: "TAT3 Itiraz Donemi",
  },
  {
    id: 28,
    title: "4. Dilim Dersleri",
    startDate: "2026-04-20",
    endDate: "2026-06-17",
    type: "etkinlik",
    description: "4. Dilim Ders Donemi",
  },
  {
    id: 29,
    title: "TAT4 (YAZILI)",
    startDate: "2026-06-22",
    endDate: "2026-06-22",
    type: "sinav",
    description: "TAT4 Yazili Sinavi",
  },
  {
    id: 30,
    title: "TAT4 (SOZLU)",
    startDate: "2026-06-18",
    endDate: "2026-06-19",
    type: "sinav",
    description: "TAT4 Sozlu Sinavi",
  },
  {
    id: 31,
    title: "Mazeret Sinav Basvurusu",
    startDate: "2026-06-18",
    endDate: "2026-06-23",
    type: "kayit",
    description: "TAT4 Mazeret Sinavi Basvurusu",
  },
  {
    id: 32,
    title: "Sinav Sonuclarinin Yayinlanmasi",
    startDate: "2026-06-24",
    endDate: "2026-06-24",
    type: "onemli",
    description: "TAT4 Sinav Sonuclari",
  },
  {
    id: 33,
    title: "TAT4 Sonucuna Itiraz",
    startDate: "2026-06-24",
    endDate: "2026-06-29",
    type: "onemli",
    description: "TAT4 Itiraz Donemi",
  },
  {
    id: 34,
    title: "Mazeret Sinavi",
    startDate: "2026-06-29",
    endDate: "2026-06-29",
    type: "sinav",
    description: "TAT4 Mazeret Sinavi",
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
    .filter((e) => e.startDate >= "2026-02-19")
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
            2025-2026 Akademik Takvimi
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
              const isToday = dateStr === "2026-02-19";
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