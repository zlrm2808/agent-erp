// Simple toast utility for demo purposes if shadcn is not fully setup
export function toast({ title, description }: { title: string; description?: string }) {
    console.log(`TOAST: ${title} - ${description}`);
    // In a real app, this would trigger a UI notification
}
