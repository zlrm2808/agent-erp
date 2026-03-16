"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import * as R from "@/components/ui/MicrosoftRibbon";
import { PayrollGenerator } from "./payroll-generator";
import { EmployeeManager } from "./employee-manager";
import { PayrollHistory } from "./payroll-history";
import { SocialBenefitsManager } from "./social-benefits";
import { DepartmentCostSummary } from "./department-costs";
import {
  Play,
  Users,
  History,
  Settings,
  BadgeCent,
  FileCheck,
  Briefcase,
  ShieldCheck,
  Download,
  UserPlus,
  Printer,
  RefreshCw,
  PieChart
} from "lucide-react";

interface PayrollDashboardClientProps {
  companyId: string;
  initialEmployees: any[];
  initialHistory: any[];
  departments: any[];
  positions: any[];
  concepts: any[];
}

export function PayrollDashboardClient({
  companyId,
  initialEmployees,
  initialHistory,
  departments,
  positions,
  concepts
}: PayrollDashboardClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") || "processing";
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);

  const setView = (view: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", view);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-0 min-h-screen bg-[#faf9f8]">
      {/* Microsoft Ribbon - Refactored for context-specific actions */}
      <R.RibbonContainer>
        <div className="flex h-28 overflow-x-auto no-scrollbar items-stretch bg-white">
          {/* ACCIONES PRINCIPALES - Dinámicas según la vista */}
          <R.RibbonGroup label="Comandos Principales">
            {activeView === "processing" && (
              <R.RibbonBtnLarge
                icon="Play"
                label="Calcular"
                color="text-[#107c10]"
              />
            )}
            {activeView === "employees" && (
              <R.RibbonBtnLarge
                icon="UserPlus"
                label="Registrar"
                color="text-[#0078d4]"
                onClick={() => setShowEmployeeForm(!showEmployeeForm)}
              />
            )}
            {activeView === "history" && (
              <R.RibbonBtnLarge
                icon="Printer"
                label="Imprimir Recibos"
                color="text-slate-600"
                onClick={() => window.print()}
              />
            )}
            <R.RibbonBtnLarge
              label="Beneficios"
              icon="ShieldCheck"
              onClick={() => setView("benefits")}
              active={activeView === "benefits"}
            />
            <R.RibbonBtnLarge
              label="Análisis Costos"
              icon="PieChart"
              onClick={() => setView("costs")}
              active={activeView === "costs"}
            />
            <R.RibbonBtnLarge
              icon="RefreshCw"
              label="Actualizar"
              color="text-slate-500"
              onClick={() => window.location.reload()}
            />
          </R.RibbonGroup>

          {/* REPORTES Y EXPORTACIONES */}
          <R.RibbonGroup label="Reportes">
            <R.RibbonBtnSmall icon="FileText" label="Listado de Personal" onClick={() => setView("employees")} />
            <R.RibbonBtnSmall icon="TrendingUp" label="Resumen de Costos" onClick={() => setView("costs")} />
            <R.RibbonBtnSmall icon="ShieldCheck" label="Prestaciones Acum." onClick={() => setView("benefits")} />
          </R.RibbonGroup>

          {/* CONFIGURACIÓN DEL MÓDULO */}
          <R.RibbonGroup label="Configuración">
            <R.RibbonBtnLarge
              icon="Settings"
              label="Leyes LOTTT"
              href={`/dashboard/${companyId}/payroll/settings`}
            />
            <R.RibbonBtnLarge
              icon="Building2"
              label="Datos Maestros"
              href={`/dashboard/${companyId}/payroll/masters`}
            />
            <R.RibbonBtnLarge
              icon="Landmark"
              label="Préstamos"
              href={`/dashboard/${companyId}/payroll/loans`}
            />
          </R.RibbonGroup>
        </div>
      </R.RibbonContainer>

      {/* View Content Area */}
      <div className="px-8 py-6 pb-12">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
          {activeView === "processing" && <PayrollGenerator companyId={companyId} />}
          {activeView === "employees" && (
            <EmployeeManager
              companyId={companyId}
              initialEmployees={initialEmployees}
              departments={departments}
              positions={positions}
              concepts={concepts}
              forceShowForm={showEmployeeForm}
              onFormClose={() => setShowEmployeeForm(false)}
            />
          )}
          {activeView === "history" && <PayrollHistory companyId={companyId} initialHistory={initialHistory} />}
          {activeView === "benefits" && (
            <SocialBenefitsManager companyId={companyId} employees={initialEmployees} />
          )}
          {activeView === "costs" && (
            <DepartmentCostSummary companyId={companyId} payrollId="latest" />
          )}
        </div>
      </div>
    </div>
  );
}
