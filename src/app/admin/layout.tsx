import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-surface">
        <div className="flex h-14 items-center px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-text-secondary hover:text-foreground mr-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Volver</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-light" />
            <span className="font-semibold">Admin Panel</span>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-6">{children}</main>
    </div>
  );
}
