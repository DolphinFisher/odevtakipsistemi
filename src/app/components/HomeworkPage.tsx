import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useHomework, Homework } from "../context/HomeworkContext";
import {
  BookOpen,
  Plus,
  X,
  Calendar,
  FileText,
  Download,
  Search,
  Filter,
  ChevronDown,
  Clock,
  AlertTriangle,
  Trash2,
  Loader2,
  AlertCircle
} from "lucide-react";

const courseOptions = [
  "Writing",
  "Grammar",
  "Listening",
  "Reading",
  "Vocabulary",
  "Speaking",
];

const statusConfig = {
  aktif: {
    label: "Aktif",
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  gecmis: {
    label: "Suresi Gecmis",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
};

export function HomeworkPage() {
  const { isAdmin, user } = useAuth();
  const { homeworks, loading, error, isOffline, addHomework, deleteHomework } = useHomework();

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newHomework, setNewHomework] = useState({
    title: "",
    description: "",
    course: "Writing",
    dueDate: "",
    attachmentName: "",
    attachmentUrl: "",
  });

  const filteredHomework = homeworks.filter((hw) => {
    const matchSearch =
      hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || hw.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAddHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addHomework({
        title: newHomework.title,
        description: newHomework.description,
        course: newHomework.course,
        dueDate: newHomework.dueDate,
        createdAt: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: "aktif",
        attachmentName: newHomework.attachmentName || undefined,
        attachmentUrl: newHomework.attachmentUrl || undefined,
        author: user?.name || "Admin",
      });

      setShowModal(false);
      setNewHomework({
        title: "",
        description: "",
        course: "Writing",
        dueDate: "",
        attachmentName: "",
        attachmentUrl: "",
      });
    } catch (err) {
      alert("Odev eklenirken bir hata olustu.");
    }
  };

  const handleDeleteHomework = async (id: number) => {
    if (window.confirm("Bu odevi silmek istediginizden emin misiniz?")) {
      try {
        await deleteHomework(id);
      } catch (err) {
        alert("Odev silinirken bir hata olustu.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-500">
          <AlertCircle className="w-10 h-10 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {isOffline && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-3 rounded-lg flex items-center gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>
            Offline Mod: Sunucuya baglanilamadi. Veriler yerel hafizadan gosteriliyor ve degisiklikler kaydedilmeyebilir.
          </p>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1>Odevler</h1>
            <p className="text-sm text-muted-foreground">
              Hazirlik sinifi odevleri ve gorevleri
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Yeni Odev Ekle
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Odev ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-card border border-border rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">Tum Odevler</option>
            <option value="aktif">Aktif</option>
            <option value="gecmis">Suresi Gecmis</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <p className="text-xl text-foreground">
            {homeworks.length}
          </p>
          <p className="text-xs text-muted-foreground">Toplam Odev</p>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-3 text-center">
          <p className="text-xl text-blue-500">
            {homeworks.filter((h) => h.status === "aktif").length}
          </p>
          <p className="text-xs text-blue-500">Aktif Odev</p>
        </div>
        <div className="bg-red-500/10 rounded-lg p-3 text-center">
          <p className="text-xl text-red-500">
            {homeworks.filter((h) => h.status === "gecmis").length}
          </p>
          <p className="text-xs text-red-500">Suresi Gecen</p>
        </div>
      </div>

      {/* Homework List */}
      <div className="space-y-3">
        {filteredHomework.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Odev bulunamadi.</p>
          </div>
        ) : (
          filteredHomework.map((hw) => {
            const config = statusConfig[hw.status];

            return (
              <div
                key={hw.id}
                className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                        {hw.course}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${config.bg} ${config.color}`}
                      >
                        <config.icon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <h3 className="mb-1">{hw.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {hw.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Son Teslim: {hw.dueDate}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {hw.author}
                      </span>
                      {hw.attachmentName && (
                        hw.attachmentUrl ? (
                          <a
                            href={hw.attachmentUrl}
                            download={hw.attachmentName}
                            className="flex items-center gap-1 text-xs text-accent hover:underline"
                          >
                            <Download className="w-3 h-3" />
                            {hw.attachmentName}
                          </a>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground cursor-not-allowed" title="Dosya bulunamadi">
                            <Download className="w-3 h-3" />
                            {hw.attachmentName}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteHomework(hw.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                      title="Odevi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Homework Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2>Yeni Odev Ekle</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddHomework} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm">Odev Basligi</label>
                <input
                  type="text"
                  value={newHomework.title}
                  onChange={(e) =>
                    setNewHomework({ ...newHomework, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  placeholder="Odev basligini girin"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">Aciklama</label>
                <textarea
                  value={newHomework.description}
                  onChange={(e) =>
                    setNewHomework({
                      ...newHomework,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm min-h-[100px] resize-none"
                  placeholder="Odev aciklamasini girin"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Ders</label>
                  <select
                    value={newHomework.course}
                    onChange={(e) =>
                      setNewHomework({ ...newHomework, course: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {courseOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Son Teslim Tarihi</label>
                  <input
                    type="text"
                    value={newHomework.dueDate}
                    onChange={(e) =>
                      setNewHomework({
                        ...newHomework,
                        dueDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Orn: 25 Subat 2026"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Ek Dosya (Opsiyonel)</label>
                <div className="relative">
                  <input
                    type="file"
                    id="homework-file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          alert("Dosya boyutu 2MB'dan kucuk olmalidir.");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewHomework({
                            ...newHomework,
                            attachmentName: file.name,
                            attachmentUrl: reader.result as string
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="homework-file"
                    className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors group"
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="p-3 bg-secondary rounded-full group-hover:bg-accent/10 transition-colors">
                        <FileText className="w-6 h-6 text-muted-foreground group-hover:text-accent" />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {newHomework.attachmentName ? (
                          <span className="text-foreground font-medium break-all">{newHomework.attachmentName}</span>
                        ) : (
                          <>
                            <span className="font-medium text-accent">Dosya secin</span>
                            <p className="text-xs text-muted-foreground mt-1">PDF, Word veya Gorsel</p>
                          </>
                        )}
                      </div>
                    </div>
                  </label>
                  {newHomework.attachmentName && (
                    <button
                      type="button"
                      onClick={() => setNewHomework({ ...newHomework, attachmentName: "" })}
                      className="absolute top-2 right-2 p-1.5 bg-background border border-border hover:bg-red-50 text-muted-foreground hover:text-red-500 rounded-full transition-colors shadow-sm"
                      title="Dosyayi Kaldir"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
                >
                  Iptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-all"
                >
                  Odev Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
