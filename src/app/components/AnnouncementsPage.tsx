import { useState } from "react";
import {
  Megaphone,
  Search,
  Filter,
  Calendar,
  Pin,
  ChevronDown,
  AlertCircle,
  Info,
  PartyPopper,
  Clock,
  Loader2,
  X,
} from "lucide-react";
import { useAnnouncement } from "../context/AnnouncementContext";
import * as Dialog from "@radix-ui/react-dialog";

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  category: "onemli" | "etkinlik" | "bilgi" | "sinav";
  pinned: boolean;
  author: string;
  link?: string;
}

const categoryConfig = {
  onemli: {
    label: "Onemli",
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  etkinlik: {
    label: "Etkinlik",
    icon: PartyPopper,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  bilgi: {
    label: "Bilgi",
    icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  sinav: {
    label: "Sinav",
    icon: Clock,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
};

export function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { announcements, loading, error } = useAnnouncement();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const filteredAnnouncements = announcements.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "all" || a.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const sortedAnnouncements = [...filteredAnnouncements].sort(
    (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)
  );

  const handleReadMore = async (url: string) => {
    setIsDetailLoading(true);
    try {
      const response = await fetch('/api/announcement-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setSelectedAnnouncement(data);
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setIsDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
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
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Megaphone className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1>Duyurular</h1>
          <p className="text-sm text-muted-foreground">
            Yabanci Diller Yuksekokulu Duyurulari
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Duyuru ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-card border border-border rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">Tum Kategoriler</option>
            <option value="onemli">Onemli</option>
            <option value="sinav">Sinav</option>
            <option value="etkinlik">Etkinlik</option>
            <option value="bilgi">Bilgi</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {sortedAnnouncements.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Megaphone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Duyuru bulunamadi.</p>
          </div>
        ) : (
          sortedAnnouncements.map((announcement) => {
            const config = categoryConfig[announcement.category];
            const isExpanded = expandedId === announcement.id;

            return (
              <div
                key={announcement.id}
                className={`bg-card rounded-xl border ${
                  announcement.pinned ? "border-accent/30 shadow-sm" : "border-border"
                } overflow-hidden transition-all hover:shadow-md cursor-pointer`}
                onClick={() =>
                  setExpandedId(isExpanded ? null : announcement.id)
                }
              >
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    {announcement.pinned && (
                      <Pin className="w-4 h-4 text-accent shrink-0 mt-1" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${config.bg} ${config.color}`}
                        >
                          <config.icon className="w-3 h-3" />
                          {config.label}
                        </span>
                        {announcement.pinned && (
                          <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                            Sabitlendi
                          </span>
                        )}
                      </div>
                      <h3 className="mb-1">{announcement.title}</h3>
                      <p
                        className={`text-sm text-muted-foreground ${
                          isExpanded ? "" : "line-clamp-2"
                        }`}
                      >
                        {announcement.content}
                      </p>
                      {announcement.link && isExpanded && (
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             handleReadMore(announcement.link!);
                           }}
                           className="text-xs text-blue-500 hover:underline mt-2 block"
                         >
                           {isDetailLoading && selectedAnnouncement?.link === announcement.link ? (
                             <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
                           ) : null}
                           Devamini Oku
                         </button>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {announcement.date}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {announcement.author}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Dialog.Root open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <Dialog.Title className="text-xl font-semibold leading-none tracking-tight">
                {selectedAnnouncement?.title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                {selectedAnnouncement?.date}
              </Dialog.Description>
            </div>
            
            {/* Content Area - Styles for embedded content */}
            <div 
              className="mt-4 text-foreground space-y-4 [&_iframe]:w-full [&_iframe]:min-h-[600px] [&_iframe]:border-0 [&_a]:text-blue-500 [&_a]:underline" 
              dangerouslySetInnerHTML={{ __html: selectedAnnouncement?.content || '' }} 
            />

            <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Kapat</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}