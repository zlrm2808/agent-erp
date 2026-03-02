"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { parseAsString, useQueryState } from "nuqs";

interface BranchContextType {
    selectedBranchId: string | null;
    setSelectedBranchId: (id: string | null) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: React.ReactNode }) {
    // We use nuqs to keep the branch ID in the URL, making it persistent across reloads
    const [branchId, setBranchId] = useQueryState("branchId", parseAsString);

    return (
        <BranchContext.Provider value={{ selectedBranchId: branchId, setSelectedBranchId: setBranchId }}>
            {children}
        </BranchContext.Provider>
    );
}

export const useBranch = () => {
    const context = useContext(BranchContext);
    if (!context) {
        throw new Error("useBranch must be used within a BranchProvider");
    }
    return context;
};
