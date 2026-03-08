"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Plus,
    Trash2,
    Search,
    FileText,
    User,
    CreditCard,
    Calculator,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { createInvoiceAction } from "../actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";

interface Item {
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    price: number;
    taxRate: number;
    isExempt: boolean;
    total: number;
}

export function BillingForm({ companyId, initialProducts = [] }: { companyId: string, initialProducts?: any[] }) {
    const [items, setItems] = useState<Item[]>([]);
    const [customer, setCustomer] = useState({ name: "", rif: "", address: "" });
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    // Calculation helpers
    const subtotal = items.reduce((acc, item) => acc + (item.isExempt ? 0 : item.quantity * item.price), 0);
    const exemptTotal = items.reduce((acc, item) => acc + (item.isExempt ? item.quantity * item.price : 0), 0);
    const taxTotal = items.reduce((acc, item) => acc + (item.isExempt ? 0 : (item.quantity * item.price * (item.taxRate / 100))), 0);
    const total = subtotal + exemptTotal + taxTotal;

    const addItem = () => {
        setItems([...items, {
            productId: "",
            sku: "",
            name: "",
            quantity: 1,
            price: 0,
            taxRate: 16,
            isExempt: false,
            total: 0
        }]);
    };

    const updateItem = (index: number, field: keyof Item, value: any) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;

        // Recalculate item total
        newItems[index].total = newItems[index].quantity * newItems[index].price;
        setItems(newItems);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!customer.name || !customer.rif) {
            toast({ title: "Error", description: "Debe completar los datos del cliente", variant: "destructive" });
            return;
        }
        if (items.length === 0) {
            toast({ title: "Error", description: "Debe agregar al menos un producto", variant: "destructive" });
            return;
        }

        startTransition(async () => {
            const result = await createInvoiceAction(companyId, {
                ...customer,
                items,
                baseAmount: subtotal,
                taxAmount: taxTotal,
                totalAmount: total
            });

            if (result.success) {
                setIsSuccess(true);
                toast({ title: "Factura Generada", description: "El documento fiscal se ha procesado correctamente." });
                setTimeout(() => router.push(`/dashboard/${companyId}/sales/invoices`), 2000);
            } else {
                toast({ title: "Error", description: result.error || "No se pudo generar la factura", variant: "destructive" });
            }
        });
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center animate-in zoom-in-95 duration-500">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                <h2 className="text-2xl font-bold text-[#323130]">¡Factura Emitida con Éxito!</h2>
                <p className="text-[#605e5c] mt-2">Documento fiscal asignado y registrado en SENIAT.</p>
                <Button className="mt-8 bg-[#0078d4]" onClick={() => router.push(`/dashboard/${companyId}/sales/invoices`)}>
                    Ver Facturas
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-700">
            {/* Left: Invoice details & Items */}
            <div className="flex-1 space-y-6">
                <div className="bg-white border border-[#e1dfdd] shadow-sm p-6 rounded-sm">
                    <div className="flex items-center gap-2 mb-6 border-b border-[#f3f2f1] pb-4">
                        <FileText className="text-[#0078d4] w-5 h-5" />
                        <h3 className="font-bold text-[#323130] uppercase text-sm tracking-widest">Detalle de Productos</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#f3f2f1]">
                                <TableRow className="border-[#e1dfdd]">
                                    <TableHead className="w-[120px] text-xs font-bold">SKU</TableHead>
                                    <TableHead className="text-xs font-bold">DESCRIPCIÓN</TableHead>
                                    <TableHead className="w-[100px] text-center text-xs font-bold">CANT</TableHead>
                                    <TableHead className="w-[120px] text-right text-xs font-bold">P. UNIT</TableHead>
                                    <TableHead className="w-[120px] text-right text-xs font-bold">TOTAL</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={index} className="border-[#f3f2f1] hover:bg-[#faf9f8]">
                                        <TableCell>
                                            <Input
                                                value={item.sku}
                                                onChange={(e) => updateItem(index, 'sku', e.target.value)}
                                                placeholder="CANT-01"
                                                className="h-8 text-xs border-transparent focus:border-[#0078d4] bg-transparent"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={item.name}
                                                onChange={(e) => updateItem(index, 'name', e.target.value)}
                                                placeholder="Descripción del producto"
                                                className="h-8 text-xs border-transparent focus:border-[#0078d4] bg-transparent"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                                className="h-8 text-xs text-center border-transparent focus:border-[#0078d4] bg-transparent"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                                                className="h-8 text-xs text-right border-transparent focus:border-[#0078d4] bg-transparent font-mono"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right text-sm font-bold font-mono">
                                            ${(item.quantity * item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-600 hover:bg-rose-50" onClick={() => removeItem(index)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <Button variant="outline" className="mt-4 border-dashed border-[#d2d0ce] text-[#605e5c] hover:text-[#0078d4] hover:bg-[#eff6fc] w-full" onClick={addItem}>
                        <Plus className="w-4 h-4 mr-2" /> Agregar Item
                    </Button>
                </div>
            </div>

            {/* Right: Sidebar with Customer & Summary */}
            <div className="w-full lg:w-[380px] space-y-6">
                {/* Customer Section */}
                <div className="bg-white border border-[#e1dfdd] shadow-sm p-6 rounded-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="text-[#0078d4] w-5 h-5" />
                        <h3 className="font-bold text-[#323130] uppercase text-xs tracking-widest">Cliente / Receptor</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase text-[#605e5c] font-bold">Razón Social</Label>
                            <Input
                                value={customer.name}
                                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                placeholder="Nombre de la empresa o persona"
                                className="h-9 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase text-[#605e5c] font-bold">RIF / Cédula</Label>
                            <Input
                                value={customer.rif}
                                onChange={(e) => setCustomer({ ...customer, rif: e.target.value })}
                                placeholder="J-12345678-9"
                                className="h-9 text-sm font-mono"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase text-[#605e5c] font-bold">Dirección Fiscal</Label>
                            <Input
                                value={customer.address}
                                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                                placeholder="Calle, Edificio, Ciudad..."
                                className="h-9 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Totals Section */}
                <div className="bg-[#001d3d] text-white p-6 rounded-sm shadow-lg overflow-hidden relative">
                    <div className="absolute top-[-20px] right-[-20px] opacity-10">
                        <Calculator size={100} />
                    </div>

                    <div className="space-y-3 relative z-10">
                        <div className="flex justify-between text-xs text-sky-200">
                            <span>Subtotal Gravado</span>
                            <span className="font-mono">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-xs text-sky-200">
                            <span>Base Exenta</span>
                            <span className="font-mono">${exemptTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-xs text-sky-200">
                            <span>IVA (16.00%)</span>
                            <span className="font-mono">${taxTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="h-px bg-white/20 my-3" />
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-sky-200 font-bold">Total a Pagar</span>
                                <span className="text-3xl font-black tabular-nums">
                                    ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <CreditCard className="w-8 h-8 opacity-40 mb-1" />
                        </div>
                    </div>

                    <Button
                        className="w-full mt-6 bg-[#0078d4] hover:bg-[#005a9e] text-white font-bold h-12 uppercase tracking-widest text-xs shadow-xl"
                        onClick={handleSubmit}
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Procesar Factura Fiscal"}
                    </Button>

                    <p className="text-[9px] text-center text-white/40 mt-4 italic">
                        El documento será firmado digitalmente bajo Providencia SNAT/2024/000102
                    </p>
                </div>
            </div>
        </div>
    );
}
