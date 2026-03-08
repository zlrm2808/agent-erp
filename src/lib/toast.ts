// Simple toast utility for demo purposes if shadcn is not fully setup
export function toast({ title, description, variant }: { title: string; description?: string; variant?: "default" | "destructive" }) {
    console.log(`TOAST [${variant || "default"}]: ${title} - ${description}`);
    // In a real app, this would trigger a UI notification
}
