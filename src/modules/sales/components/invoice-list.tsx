"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileDown, MoreHorizontal, Printer } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Invoice {
    id: string;
    invoiceNumber: string | null;
    controlNumber: string | null;
    customerName: string;
    customerRif: string;
    totalAmount: number;
    date: Date | string;
    status: string;
}

export function InvoiceList({ invoices, companyId }: { invoices: any[], companyId: string }) {
    if (invoices.length === 0) {
        return (
            <div className="rounded-md border border-dashed border-[#e1dfdd] p-12 text-center bg-[#faf9f8]">
                <FileDown className="mx-auto h-12 w-12 text-[#a19f9d] mb-4" />
                <h3 className="text-lg font-semibold text-[#323130]">No hay facturas emitidas</h3>
                <p className="text-sm text-[#605e5c] mt-2 mb-6">
                    Comienza a facturar para ver aquí tus documentos fiscales.
                </p>
                <Button className="bg-[#0078d4]" asChild>
                    <Link href={`/dashboard/${companyId}/sales/invoices/new`}>
                        Nueva Factura
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="rounded-md border border-[#e1dfdd] bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-[#f3f2f1]">
                    <TableRow className="border-[#e1dfdd]">
                        <TableHead className="font-bold text-[#605e5c] w-[120px]">FECHA</TableHead>
                        <TableHead className="font-bold text-[#605e5c]">FACTURA #</TableHead>
                        <TableHead className="font-bold text-[#605e5c]">CONTROL #</TableHead>
                        <TableHead className="font-bold text-[#605e5c]">CLIENTE</TableHead>
                        <TableHead className="font-bold text-[#605e5c] text-right">TOTAL</TableHead>
                        <TableHead className="font-bold text-[#605e5c] w-[120px]">ESTADO</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.id} className="hover:bg-[#faf9f8] border-[#e1dfdd]/50 group">
                            <TableCell className="text-xs text-[#605e5c]">
                                {new Date(invoice.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-mono text-xs font-bold text-[#0078d4]">
                                {invoice.invoiceNumber || "PROCESANDO..."}
                            </TableCell>
                            <TableCell className="font-mono text-[10px] text-[#605e5c]">
                                {invoice.controlNumber || "-"}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm text-[#323130]">{invoice.customerName}</span>
                                    <span className="text-[10px] text-[#605e5c] font-mono uppercase">{invoice.customerRif}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-black text-[#323130] tabular-nums">
                                ${invoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell>
                                <Badge className={cn(
                                    "rounded-sm px-2 py-0.5 text-[10px] uppercase font-bold",
                                    invoice.status === 'issued' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-rose-100 text-rose-700 hover:bg-rose-100"
                                )}>
                                    {invoice.status === 'issued' ? 'Emitida' : 'Anulada'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Printer className="mr-2 h-4 w-4" /> Imprimir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
