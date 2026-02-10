import { z } from "zod";

/**
 * Schema for Login validation
 * Requirement: Use username instead of email.
 */
export const loginSchema = z.object({
  username: z.string().min(3, {
    message: "El usuario debe tener al menos 3 caracteres.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
  selectCompany: z.boolean().default(false),
});

export type LoginValues = z.infer<typeof loginSchema>;
