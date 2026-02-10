
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
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
    id: string;
    sku: string;
    name: string;
    stock: number;
    salePrice: number;
    minStock: number;
    category?: { name: string } | null;
}

interface ProductListProps {
    products: Product[];
    companyId: string;
}

export function ProductList({ products, companyId }: ProductListProps) {
    if (products.length === 0) {
        return (
            <div className="rounded-md border border-dashed border-[#e1dfdd] p-12 text-center bg-[#faf9f8]">
                <div className="mx-auto h-12 w-12 text-[#a19f9d] mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#323130]">No hay productos registrados</h3>
                <p className="text-sm text-[#605e5c] mt-2 mb-6">
                    Comienza agregando productos a tu inventario.
                </p>
                <Button className="bg-primary hover:bg-primary/90" asChild>
                    <Link href={`/dashboard/${companyId}/inventory/products/new`}>
                        Crear primer producto
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
                        <TableHead className="font-bold text-[#605e5c] w-[100px]">SKU</TableHead>
                        <TableHead className="font-bold text-[#605e5c]">Producto</TableHead>
                        <TableHead className="font-bold text-[#605e5c]">Categoría</TableHead>
                        <TableHead className="font-bold text-[#605e5c] text-right">Precio</TableHead>
                        <TableHead className="font-bold text-[#605e5c] text-center w-[100px]">Stock</TableHead>
                        <TableHead className="font-bold text-[#605e5c] w-[120px]">Estado</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id} className="hover:bg-[#faf9f8] border-[#e1dfdd]/50">
                            <TableCell className="font-mono text-xs text-[#605e5c]">{product.sku}</TableCell>
                            <TableCell className="font-medium text-[#323130]">{product.name}</TableCell>
                            <TableCell className="text-[#605e5c] text-xs">{product.category?.name || "-"}</TableCell>
                            <TableCell className="text-right font-bold text-[#323130] tabular-nums">
                                ${product.salePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-center font-bold tabular-nums">{product.stock}</TableCell>
                            <TableCell>
                                {product.stock <= product.minStock ? (
                                    <Badge variant="destructive" className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200">Bajo Stock</Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">En Stock</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-[#edebe9]">
                                            <span className="sr-only">Abrir menú</span>
                                            <MoreHorizontal className="h-4 w-4 text-[#605e5c]" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/dashboard/${companyId}/inventory/products/${product.id}/edit`} className="cursor-pointer flex items-center">
                                                <Edit className="mr-2 h-4 w-4" /> Editar
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-rose-600 cursor-pointer focus:text-rose-600 focus:bg-rose-50">
                                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
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
