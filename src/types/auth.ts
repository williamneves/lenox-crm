import { z } from "zod";

// Regex for username validadion
// Rules, only letters, numbers, underscores, dashes, and dots (no spaces and at @)
export const usernameRegex = /^[a-zA-Z0-9_.-]*$/;

// Clerk Auth Types with Zod
export const clerkLoginParamsSchema = z.object({
	// Schema uses email or password to login
	identifier: z
		.string()
    .min(3, 'Muito curto')
    .default('')
		.refine((value) => {
			if (value.includes('@')) {
				return z.string().email().parse(value);
			}

			return usernameRegex.test(value);
		}, 'Email ou username inválido')
		.transform((value) => value.trim()),
	password: z.string().min(4, 'Senha muito curta').default('').transform((value) => value.trim()),
});

export type ClerkLoginParamsType = z.infer<typeof clerkLoginParamsSchema>;
