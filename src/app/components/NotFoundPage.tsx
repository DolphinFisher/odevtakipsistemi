import { Link } from "react-router";
import { Home, AlertCircle } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-4xl text-foreground">404</h1>
        <p className="text-muted-foreground max-w-md">
          Aradaginiz sayfa bulunamadi. Ana sayfaya donmek icin asagidaki butonu kullanabilirsiniz.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
        >
          <Home className="w-4 h-4" />
          Ana Sayfaya Don
        </Link>
      </div>
    </div>
  );
}
