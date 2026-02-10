
import { StatsCard } from "@/modules/dashboard/stats-card";
import { Box, TriangleAlert, DollarSign } from "lucide-react";

interface InventoryStatsProps {
    stats: {
        totalProducts: number;
        totalValue: number;
        lowStock: number;
    };
}

export function InventoryStats({ stats }: InventoryStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard
                title="Total Productos"
                value={stats.totalProducts.toString()}
                icon={Box}
                description="Items registrados en sistema"
            />
            <StatsCard
                title="Valor Inventario"
                value={`$${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={DollarSign}
                description="Costo total estimado"
            />
            <StatsCard
                title="Alertas Stock"
                value={stats.lowStock.toString()}
                icon={TriangleAlert}
                description="Productos bajo mínimo"
            />
        </div>
    );
}
