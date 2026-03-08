"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface UIPersistenceContextType {
    showBreadcrumb: boolean;
    setShowBreadcrumb: (value: boolean) => void;
}

const UIPersistenceContext = createContext<UIPersistenceContextType | undefined>(undefined);

export function UIPersistenceProvider({ children }: { children: React.ReactNode }) {
    const [showBreadcrumb, setShowBreadcrumb] = useState<boolean>(true);

    // Load preference from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("erp_show_breadcrumb");
        if (saved !== null) {
            setShowBreadcrumb(saved === "true");
        }
    }, []);

    const handleSetShowBreadcrumb = (value: boolean) => {
        setShowBreadcrumb(value);
        localStorage.setItem("erp_show_breadcrumb", String(value));
    };

    return (
        <UIPersistenceContext.Provider value={{ showBreadcrumb, setShowBreadcrumb: handleSetShowBreadcrumb }}>
            {children}
        </UIPersistenceContext.Provider>
    );
}

export function useUIPersistence() {
    const context = useContext(UIPersistenceContext);
    if (context === undefined) {
        throw new Error("useUIPersistence must be used within a UIPersistenceProvider");
    }
    return context;
}
