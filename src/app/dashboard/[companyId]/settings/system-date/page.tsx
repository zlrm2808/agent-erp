import { SystemDateForm } from "./form";
import { CalendarClock, Settings2, RotateCcw } from "lucide-react";
import * as R from "@/components/ui/MicrosoftRibbon";

export default async function SystemDatePage() {
    return (
        <div className="space-y-0 -m-6 flex flex-col h-full overflow-hidden">
            <R.RibbonContainer>
                <div className="flex items-stretch overflow-x-auto no-scrollbar">
                    <R.RibbonGroup label="Acciones">
                        <R.RibbonBtnLarge icon="Settings2" label="Configurar" href="" active />
                    </R.RibbonGroup>
                    <R.RibbonGroup label="Vista">
                        <R.RibbonBtnLarge icon="RotateCcw" label="Refrescar" href="" />
                    </R.RibbonGroup>
                </div>
            </R.RibbonContainer>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="flex items-center gap-3 border-b border-[#e1dfdd] pb-6">
                    <div className="p-3 bg-blue-50 rounded-sm">
                        <CalendarClock className="text-[#0078d4] w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[#323130] tracking-tight uppercase">
                            Fecha del Sistema
                        </h2>
                        <p className="text-[11px] text-[#605e5c] font-medium uppercase tracking-wider">
                            Configuración de periodo de trabajo y simulación
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 border border-[#e1dfdd] shadow-sm rounded-sm">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-[#323130] uppercase">¿Cómo funciona?</h3>
                            <p className="text-sm text-[#605e5c] leading-relaxed">
                                Esta función permite que el ERP "viaje en el tiempo". Todas las transacciones, registros de nómina, ingresos de inventario y facturación utilizarán la fecha seleccionada aquí en lugar de la fecha real del reloj.
                            </p>
                            <p className="text-sm text-[#605e5c] leading-relaxed">
                                Esto es extremadamente útil para:
                            </p>
                            <ul className="list-disc list-inside text-sm text-[#605e5c] space-y-2 pl-2">
                                <li>Cierres de mes extemporáneos.</li>
                                <li>Corrección de registros pasados.</li>
                                <li>Pruebas de cálculos de nómina en periodos específicos.</li>
                            </ul>
                        </div>

                        <div>
                            <SystemDateForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
