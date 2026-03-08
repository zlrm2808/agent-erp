import { cookies } from "next/headers";

/**
 * Gets the current system date.
 * If a "system_date" cookie is present and valid, it returns that date.
 * Otherwise, it returns the current real date.
 */
export async function getSystemDate(): Promise<Date> {
    const cookieStore = await cookies();
    const systemDateStr = cookieStore.get("system_date")?.value;

    if (systemDateStr) {
        const date = new Date(systemDateStr);
        if (!isNaN(date.getTime())) {
            return date;
        }
    }

    return new Date();
}

/**
 * Formats a date for display or for the database, 
 * respecting the system date if applicable.
 */
export async function formatSystemDate(date?: Date): Promise<string> {
    const targetDate = date || await getSystemDate();
    return targetDate.toLocaleDateString("es-VE", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
