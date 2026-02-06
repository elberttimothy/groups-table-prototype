import { z } from 'zod';

export const ErrorSchema = z.object({
  error: z.string(),
});

export const IdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type ApiError = z.infer<typeof ErrorSchema>;
export type IdParam = z.infer<typeof IdParamSchema>;
