import { Brain, LogOut, Shield, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <Brain className="h-5 w-5 text-primary" />
          <span>DocRAG</span>
        </Link>

        <nav className="flex items-center gap-2">
          {user?.role === "admin" && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin">
                <Shield className="mr-1.5 h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}
          <div className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span className="max-w-[140px] truncate">{user?.full_name || user?.email}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </header>
  );
}
