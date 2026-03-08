"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Save, RotateCcw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SystemDateForm() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const router = useRouter();

    const handleSave = () => {
        if (!date) return;

        // Save to cookie (simple way for now)
        document.cookie = `system_date=${date.toISOString()}; path=/; max-age=86400`;
        toast.success("Fecha del sistema actualizada correctamente");
        router.refresh();
    };

    const handleReset = () => {
        document.cookie = "system_date=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setDate(new Date());
        toast.info("Se ha restaurado la fecha real del sistema");
        router.refresh();
    };

    return (
        <div className="max-w-md space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex gap-3 text-amber-800">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                    <p className="font-bold uppercase tracking-tight">Atención: Modo Simulación</p>
                    <p>Cambiar la fecha del sistema afectará a todos los cálculos, reportes y registros que realices a partir de ahora. Úsalo con precaución.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-[#605e5c] uppercase tracking-widest">Seleccionar Fecha de Trabajo</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal h-12 border-[#d2d0ce]",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-[#0078d4]" />
                                {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                locale={es}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} className="flex-1 bg-[#0078d4] hover:bg-[#005a9e] text-xs font-bold uppercase tracking-widest">
                        <Save className="mr-2 h-4 w-4" /> Aplicar Fecha
                    </Button>
                    <Button onClick={handleReset} variant="outline" className="border-[#d2d0ce] text-xs font-bold uppercase tracking-widest">
                        <RotateCcw className="mr-2 h-4 w-4" /> Restaurar
                    </Button>
                </div>
            </div>
        </div>
    );
}
