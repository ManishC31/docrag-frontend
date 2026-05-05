import { Brain } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Brain className="h-7 w-7 text-primary" />
        DocRAG
      </div>
      <LoginForm />
    </div>
  );
}
