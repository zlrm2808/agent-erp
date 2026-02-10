"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { loginSchema, type LoginValues } from "./schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Lock, User, Building2 } from "lucide-react";
import { useState } from "react";
import { loginAction } from "./actions";
import { useRouter } from "next/navigation";

/**
 * LoginForm - Professional, minimalist, and mobile-first.
 * Implements validation with Zod and React Hook Form.
 */
export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
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
                // Si el usuario marcó "Seleccionar Empresa", redirigir a la pantalla de selección
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
        <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 backdrop-blur-md">
            <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Acceso al Sistema</CardTitle>
                <CardDescription>
                    Ingresa tus credenciales para acceder a AgentERP
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {serverError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg animate-in fade-in slide-in-from-top-1">
                            {serverError}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="username">Usuario</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="username"
                                placeholder="Nombre de usuario"
                                className={`pl-10 ${errors.username ? "border-red-500" : ""}`}
                                {...register("username")}
                            />
                        </div>
                        {errors.username && (
                            <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                                {...register("password")}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Controller
                            name="selectCompany"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    id="selectCompany"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="selectCompany"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                            >
                                <Building2 size={14} className="text-muted-foreground" />
                                Seleccionar empresa al entrar
                            </label>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full py-6 text-base font-semibold transition-all hover:scale-[1.02]"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Iniciando sesión...
                            </>
                        ) : (
                            "Iniciar Sesión"
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
