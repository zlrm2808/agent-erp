import { LoginForm } from "@/modules/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="z-10 w-full flex flex-col items-center">
        <LoginForm />
      </div>
    </div>
  );
}
