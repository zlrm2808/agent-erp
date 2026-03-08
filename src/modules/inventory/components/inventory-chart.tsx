"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface InventoryChartProps {
    data: { name: string; value: number }[];
}

export function InventoryChart({ data }: InventoryChartProps) {
    return (
        <div className="rounded-lg border border-[#e1dfdd] bg-white p-6 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-[#323130] mb-4">Top 5 Productos por Valor en Stock</h3>
            {data.length === 0 ? (
                <div className="rounded-md border border-dashed border-[#e1dfdd] p-8 text-center bg-[#faf9f8]">
                    <p className="text-sm text-[#605e5c]">No hay datos suficientes para mostrar el gráfico.</p>
                </div>
            ) : (
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e1dfdd" />
                            <XAxis type="number" tickFormatter={(value) => `$${value}`} stroke="#605e5c" fontSize={12} />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#605e5c"
                                fontSize={12}
                                width={120}
                                tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                            />
                            <Tooltip
                                formatter={(value: any) => [`$${Number(value).toLocaleString("es-VE", { minimumFractionDigits: 2 })}`, "Valor"]}
                                contentStyle={{ borderRadius: '4px', border: '1px solid #e1dfdd', fontSize: '12px' }}
                            />
                            <Bar dataKey="value" fill="#d83b01" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
