"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { OfflineStorage } from "@/lib/offline-db";
import { syncOfflineInvoicesAction, syncOfflineMovementsAction } from "@/modules/sync/actions";
import { toast } from "@/lib/toast";

interface OfflineSyncContextType {
    isOnline: boolean;
    pendingCount: number;
    sync: () => Promise<void>;
}

const OfflineSyncContext = createContext<OfflineSyncContextType | undefined>(undefined);

export function OfflineSyncProvider({ children, companyId }: { children: React.ReactNode; companyId: string }) {
    const [isOnline, setIsOnline] = useState(true);
    const [pendingCount, setPendingCount] = useState(0);

    const updatePendingCount = async () => {
        const invoices = await OfflineStorage.getPendingInvoices();
        const movements = await OfflineStorage.getPendingMovements();
        setPendingCount(invoices.length + movements.length);
    };

    const sync = async () => {
        if (!navigator.onLine) return;

        try {
            // 1. Sync Invoices
            const pendingInvoices = await OfflineStorage.getPendingInvoices();
            if (pendingInvoices.length > 0) {
                const result = await syncOfflineInvoicesAction(companyId, pendingInvoices);
                if (result.success && result.results) {
                    // Delete successfully synced invoices from local DB
                    for (const res of result.results) {
                        if (res.status === "synced" || res.status === "already_synced") {
                            await OfflineStorage.deleteInvoice(res.localId);
                        }
                    }
                }
            }

            // 2. Sync Movements
            const pendingMovements = await OfflineStorage.getPendingMovements();
            if (pendingMovements.length > 0) {
                const result = await syncOfflineMovementsAction(companyId, pendingMovements);
                if (result.success && result.results) {
                    for (const res of result.results) {
                        if (res.status === "synced" || res.status === "already_synced") {
                            await OfflineStorage.deleteMovement(res.localId);
                        }
                    }
                }
            }

            await updatePendingCount();

            if (pendingCount > 0) {
                toast({
                    title: "Sincronización completada",
                    description: "Tus transacciones offline han sido cargadas al servidor exitosamente.",
                });
            }
        } catch (error) {
            console.error("Sync failed:", error);
        }
    };

    useEffect(() => {
        if (typeof window === "undefined") return;

        setIsOnline(navigator.onLine);
        updatePendingCount();

        const handleOnline = () => {
            setIsOnline(true);
            sync();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [companyId]);

    return (
        <OfflineSyncContext.Provider value={{ isOnline, pendingCount, sync }}>
            {children}
            {!isOnline && (
                <div className="fixed bottom-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2 animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    Trabajando sin conexión
                </div>
            )}
        </OfflineSyncContext.Provider>
    );
}

export const useOfflineSync = () => {
    const context = useContext(OfflineSyncContext);
    if (!context) {
        throw new Error("useOfflineSync must be used within an OfflineSyncProvider");
    }
    return context;
};
