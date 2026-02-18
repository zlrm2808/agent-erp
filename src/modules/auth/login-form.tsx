"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { loginSchema, type LoginValues } from "./schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { loginAction } from "./actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LogoERP from "@/assets/agenterp-logo.png";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      selectCompany: false,
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const result = await loginAction(data);
      if (result?.error) {
        setServerError(result.error);
      } else if (result?.success) {
        if (data.selectCompany) {
          router.push("/select-company");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setServerError("Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-[#f6f7f8] dark:bg-[#101922]">
      {/* Lado Izquierdo: Hero Image (Oculto en móvil) */}
      <div
        className="relative hidden lg:flex lg:w-3/5 xl:w-2/3 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')" }}
      >
        <div className="absolute inset-0 bg-linear-to-tr from-[#137fec]/80 to-slate-900/40 mix-blend-multiply" />
        <div className="relative z-10 flex h-full w-full max-w-4xl flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold tracking-tight mb-4">AgentERP</h2>
          <p className="max-w-xl text-lg font-light text-white/90">
            Empodera tu negocio con una solución integral que conecta equipos de ventas, servicio, finanzas y operaciones.
          </p>
          
        </div>
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="relative flex w-full flex-col items-center justify-center p-8 lg:w-2/5 lg:p-12 xl:w-1/3 bg-white dark:bg-slate-900 shadow-2xl">
        <div className="z-10 w-full max-w-100">

          {/* Logo Microsoft Style */}
          <div className="mb-8 flex justify-start">
            <Image src={LogoERP} alt="AgentERP Logo" className="h-8 w-auto object-contain" />
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Iniciar sesión</h1>
          <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
            Inicie sesión en su cuenta para continuar con la gestión inteligente de su negocio.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
                {serverError}
              </div>
            )}

            {/* Input Usuario */}
            <div className="space-y-1.5">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                {...register("username")}
                placeholder="instroduzca su usuario"
                className={`bg-[#f6f7f8] dark:bg-slate-800 border-slate-300 dark:border-slate-700 py-2.5 focus:ring-[#137fec] ${errors.username ? "border-red-500" : ""
                  }`}
              />
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>

            {/* Input Password */}
            <div className="space-y-1.5 relative">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Introduzca su contraseña"
                  className={`bg-[#f6f7f8] dark:bg-slate-800 border-slate-300 dark:border-slate-700 py-2.5 pr-10 focus:ring-[#137fec] ${errors.password ? "border-red-500" : ""
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Checkbox y Olvido Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Controller
                  name="selectCompany"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="selectCompany"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-slate-300 data-[state=checked]:bg-[#137fec] data-[state=checked]:border-[#137fec]"
                    />
                  )}
                />
                <Label htmlFor="selectCompany" className="text-sm font-normal cursor-pointer text-slate-700 dark:text-slate-300">
                  Seleccionar empresa al entrar
                </Label>
              </div>
            </div>

            {/* Botón Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#137fec] py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>

          {/* Opciones Adicionales */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Otras opciones</span>
              </div>
            </div>
            <div className="mt-6">
              <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-white hover:bg-slate-50 transition-colors">
                <ShieldCheck size={18} className="text-slate-500" />
                Iniciar sesión con llave de seguridad
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 text-center lg:absolute lg:bottom-6 lg:right-12 lg:text-right w-full">
          <div className="flex flex-wrap justify-center lg:justify-end gap-x-6 gap-y-2 text-xs text-slate-500">
            
            <span>© Zeus Rodríguez 2026. Todos los derechos reservados.</span>
          </div>
        </div>
      </div>
    </div>
  );
}