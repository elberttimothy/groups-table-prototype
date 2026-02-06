import { z } from 'zod'

export const HealthResponseSchema = z.object({
  status: z.enum(['healthy', 'unhealthy']),
  timestamp: z.string(),
  database: z.enum(['connected', 'disconnected']),
  error: z.string().optional(),
})

export type HealthResponse = z.infer<typeof HealthResponseSchema>
