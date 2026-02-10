import { LoginForm } from "@/modules/auth/login-form";

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
            {/* Premium Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px]" />

            <div className="z-10 w-full flex flex-col items-center">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 mb-2">
                        Agent<span className="text-primary">ERP</span>
                    </h1>
                    <p className="text-slate-500 font-medium tracking-wide uppercase text-xs">
                        Gestión Inteligente de Negocios
                    </p>
                </div>

                <LoginForm />

                <footer className="mt-12 text-slate-400 text-sm">
                    &copy; {new Date().getFullYear()} Antigravity Dev Team. Todos los derechos reservados.
                </footer>
            </div>
        </div>
    );
}
