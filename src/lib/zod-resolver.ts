import type { ZodSchema } from "zod";

/**
 * Custom Zod Resolver for React Hook Form.
 * Used to bypass module resolution issues with @hookform/resolvers/zod in Turbopack/Bun environments.
 */
export const zodResolver = (schema: ZodSchema<any>) => async (data: any) => {
    try {
        const values = await schema.parseAsync(data);
        return { values, errors: {} };
    } catch (error: any) {
        return {
            values: {},
            errors: error.issues.reduce((acc: any, issue: any) => {
                const path = issue.path.join(".");
                acc[path] = {
                    type: issue.code,
                    message: issue.message,
                };
                return acc;
            }, {}),
        };
    }
};
