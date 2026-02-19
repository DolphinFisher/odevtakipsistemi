import { Link } from "react-router";
import {
  Megaphone,
  BookOpen,
  CalendarDays,
  Clock,
  ArrowRight,
  Bell,
  FileText,
} from "lucide-react";
import { useAnnouncement } from "../context/AnnouncementContext";
import { useHomework } from "../context/HomeworkContext";

export function DashboardPage() {
  const { announcements, newAnnouncementCount } = useAnnouncement();
  const { homeworks } = useHomework();

  const recentAnnouncements = announcements.slice(0, 3).map((a) => ({
    id: a.id,
    title: a.title,
    date: a.date,
    type: a.category,
  }));

  const activeHomeworks = homeworks.filter(h => h.status === 'aktif');
  const upcomingHomework = activeHomeworks.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-20 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <h1 className="text-2xl text-white mb-2">
            Ankara Medipol Universitesi
          </h1>
          <p className="text-white/80 max-w-lg">
            Yabanci Diller Yuksekokulu - Hazirlik Sinifi Odev Paylasim Platformuna hos geldiniz. Odevlerinizi takip edin, duyurulari kontrol edin ve akademik takvimi inceleyin.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/duyurular" className="bg-card rounded-xl p-5 border border-border hover:shadow-lg hover:border-accent/40 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Megaphone className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs text-muted-foreground">Bu Hafta</span>
          </div>
          <p className="text-2xl text-foreground">{newAnnouncementCount}</p>
          <p className="text-sm text-muted-foreground">Yeni Duyuru</p>
        </Link>

        <Link to="/odevler" className="bg-card rounded-xl p-5 border border-border hover:shadow-lg hover:border-accent/40 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-xs text-muted-foreground">Aktif</span>
          </div>
          <p className="text-2xl text-foreground">{activeHomeworks.length}</p>
          <p className="text-sm text-muted-foreground">Guncel Odev</p>
        </Link>

        <Link to="/odevler" className="bg-card rounded-xl p-5 border border-border hover:shadow-lg hover:border-accent/40 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-xs text-muted-foreground">Toplam</span>
          </div>
          <p className="text-2xl text-foreground">{homeworks.length}</p>
          <p className="text-sm text-muted-foreground">Paylasilan Odev</p>
        </Link>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" />
              <h3>Son Duyurular</h3>
            </div>
            <Link
              to="/duyurular"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              Tumunu Gor
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentAnnouncements.map((a) => (
              <div key={a.id} className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 shrink-0 ${a.type === "onemli"
                      ? "bg-red-500"
                      : a.type === "etkinlik"
                        ? "bg-green-500"
                        : "bg-blue-500"
                      }`}
                  />
                  <div>
                    <p className="text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {a.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Homework */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <h3>Yaklasan Odevler</h3>
            </div>
            <Link
              to="/odevler"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              Tumunu Gor
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {upcomingHomework.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Aktif odev bulunmamaktadir.
              </div>
            ) : (
              upcomingHomework.map((hw) => (
                <div key={hw.id} className="p-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">{hw.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {hw.course}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full">
                        {hw.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
